from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
from langchain_groq import ChatGroq
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate, ChatPromptTemplate
from youtube_transcript_api import YouTubeTranscriptApi
import validators

load_dotenv()
os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY")

app = Flask(__name__)


def summarize_video_pipeline(url):
    llm = ChatGroq(model="llama-3.3-70b-versatile")

    def extract_video_id(url):
        if "youtube.com/watch?v=" in url:
            return url.split("v=")[1].split("&")[0]
        elif "youtu.be/" in url:
            return url.split("youtu.be/")[1].split("?")[0]
        else:
            return None

    if not validators.url(url):
        raise ValueError("Not a valid URL.")

    video_id = extract_video_id(url)
    if not video_id:
        raise ValueError("Invalid YouTube URL format.")

    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        transcript_text = " ".join([t['text'] for t in transcript_list])
    except Exception as e:
        raise RuntimeError(f"Error fetching transcript: {str(e)}")

    document = Document(page_content=transcript_text)

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=100, chunk_overlap=20)
    documents = text_splitter.split_documents(documents=[document])

    prompt = PromptTemplate(
        template="""
        Provide the summary of the provided chunk. Think step by step before providing a detailed answer.
        Summarize the following chunk in a clear, concise, and informative way. Maintain important facts and avoid repetition.
        \n{documents}\n{query}\n""",
        input_variables=["query", "documents"],
    )

    chain = prompt | llm

    def summarize_chunk(chunk):
        return chain.invoke({"query": "give the summary", "documents": chunk})

    partial_summaries = [summarize_chunk(c.page_content) for c in documents]
    final_combined_summary = " ".join(item.content for item in partial_summaries)

    prompt2 = ChatPromptTemplate.from_messages(
        [
            ("system", "give the summary of the following text. Use proper headings, subheadings, bullet points, paragraphs where appropriate. Use HTML tags to format the text. Use a clear and concise writing style. For new line use <br> tag."),
            ("user", "{input}")
        ]
    )
    chain2 = prompt2 | llm
    final_summary = chain2.invoke({"input": final_combined_summary})

    return final_summary.content


@app.route('/summarize_video', methods=['POST'])
def summarize_video():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        url = data.get("videoUrl")
        if not url:
            return jsonify({"error": "Missing 'videoUrl' field"}), 400

        summarized_text = summarize_video_pipeline(url)
        return jsonify({
            "summarizedText": summarized_text,
            "status": "success"
        })

    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500
