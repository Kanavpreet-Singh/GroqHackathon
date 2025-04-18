from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
from langchain_groq import ChatGroq
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate, ChatPromptTemplate
from langchain_core.pydantic_v1 import BaseModel, Field
from youtube_transcript_api import YouTubeTranscriptApi
import validators
import pickle

class Summary(BaseModel):
    summary: str = Field(description="The generated summary")

app = Flask(__name__)

# Load models
model1 = pickle.load(open('fake_news_detctor/DT.pkl','rb'))
model2 = pickle.load(open('fake_news_detctor/GB.pkl','rb'))
model3 = pickle.load(open('fake_news_detctor/LR.pkl','rb'))
model4 = pickle.load(open('fake_news_detctor/RF.pkl','rb'))



def ask_is_from_2019(text):
    llm = ChatGroq(model="Gemma2-9b-It", temperature=0.3)
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a fact-checking assistant. Answer in one word: 'Yes' or 'No'."),
        ("user", "Is the following text or video content from the year 2019?\n\n{text}")
    ])
    chain = prompt | llm
    response = chain.invoke({"text": text})
    return response.content.strip().lower()

def run_fake_news_models(text):
    predictions = [
        model1.predict([text])[0],
        model2.predict([text])[0],
        model3.predict([text])[0],
        model4.predict([text])[0]
    ]
    count_real = predictions.count("Not A Fake News")
    return "Real" if count_real >= 2 else "Fake"

def summarize_text(text):
    print("heelllo")
    llm = ChatGroq(model="Gemma2-9b-It", temperature=0.3)
    if not text or not text.strip():
        raise ValueError("Empty input text provided")

    text_documents = [Document(page_content=text)]
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    documents = text_splitter.split_documents(text_documents)

    parser = JsonOutputParser(pydantic_object=Summary)

    prompt = PromptTemplate(
        template="""
        You are a professional summarization assistant. 
        Generate a JSON-formatted summary of the following text chunk.
        The output MUST contain only JSON with a 'summary' field.

        Text chunk:
        {input_text}

        {format_instructions}
        """,
        input_variables=["input_text"],
        partial_variables={
            "format_instructions": parser.get_format_instructions()
        },
    )

    chain = prompt | llm | parser

    def summarize_chunk(chunk):
        try:
            result = chain.invoke({"input_text": chunk.page_content})
            return result
        except Exception:
            return {"summary": chunk.page_content[:500] + "..."}

    partial_summaries = [summarize_chunk(c) for c in documents]
    combined = " ".join(item['summary'] for item in partial_summaries)

    final_prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a formatting assistant. Format this summary with:
         - Clear headings
         - Bullet points for key items
         - Paragraphs for longer explanations
         - Proper HTML tags (<h2>, <p>, <ul>, <li>, <br>)
         - No JSON formatting"""),
        ("user", "{input}")
    ])

    final_chain = final_prompt | llm
    final_summary = final_chain.invoke({"input": combined})
    return final_summary.content

@app.route('/summarize', methods=['POST'])
def summarize():
    try:
        data = request.get_json()
        if not data or "originalText" not in data:
            return jsonify({"error": "Missing 'originalText' field"}), 400

        original_text = data["originalText"]
        summarized_text = summarize_text(original_text)
        is_2019 = ask_is_from_2019(original_text)

        if is_2019 == "yes":
            result = run_fake_news_models(original_text)
        elif is_2019 == "no":
            result = "Cant tell"
        else:
            return jsonify({"error": "Unexpected LLM response", "status": "error"}), 500
        print(result)
        return jsonify({
            "result": result,
            "summarizedText": summarized_text,
            "status": "success"
        })

    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

def extract_video_id(url):
    if "youtube.com/watch?v=" in url:
        return url.split("v=")[1].split("&")[0]
    elif "youtu.be/" in url:
        return url.split("youtu.be/")[1].split("?")[0]
    else:
        return None

@app.route('/summarize-video', methods=['POST'])
def summarize_video():
    try:
        data = request.get_json()
        if not data or 'videoUrl' not in data:
            return jsonify({"error": "Missing 'videoUrl' field"}), 400

        url = data['videoUrl']
        if not validators.url(url):
            return jsonify({"error": "Invalid URL"}), 400

        video_id = extract_video_id(url)
        if not video_id:
            return jsonify({"error": "Could not extract video ID"}), 400

        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        transcript_text = " ".join([t['text'] for t in transcript_list])
        summarized_text = summarize_text(transcript_text)
        is_2019 = ask_is_from_2019(transcript_text)

        if is_2019 == "yes":
            result = run_fake_news_models(transcript_text)
        elif is_2019 == "no":
            result = "Cant tell"
        else:
            return jsonify({"error": "Unexpected LLM response", "status": "error"}), 500

        return jsonify({
            "result": result,
            "summarizedText": summarized_text,
            "status": "success"
        })

    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
