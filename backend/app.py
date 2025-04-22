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
from flask_cors import CORS

class Summary(BaseModel):
    summary: str = Field(description="The generated summary")

class QuestionAnswer(BaseModel):
    answer: str = Field(description="The answer to the question")

class FakeNewsAnalysis(BaseModel):
    is_fake: bool = Field(description="Whether the news is likely fake")
    confidence: float = Field(description="Confidence score of the analysis")
    reasons: list[str] = Field(description="List of reasons supporting the analysis")
    suggestions: list[str] = Field(description="Suggestions for fact-checking")

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:8080"]}})

def summarize_video_pipeline(original_text):
    llm = ChatGroq(model="Gemma2-9b-It", temperature=0.3)
    
    if not original_text or not original_text.strip():
        raise ValueError("Empty input text provided")

    
    text_documents = [Document(page_content=original_text)]
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000, 
        chunk_overlap=200,
        length_function=len
    )
    documents = text_splitter.split_documents(text_documents)
    
    if not documents:
        raise ValueError("No documents created after splitting")

    
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
        except Exception as e:
            
            return {"summary": chunk.page_content[:500] + "..."}

    partial_summaries = [summarize_chunk(c) for c in documents]
    final_combined_summary = " ".join(item['summary'] for item in partial_summaries)

    # Final formatting
    final_prompt = ChatPromptTemplate.from_messages([
        ("system", """You are a formatting assistant. Format this summary with proper HTML tags:
         - Use <h2> for main headings
         - Use <h3> for subheadings
         - Use <p> for paragraphs
         - Use <ul> and <li> for bullet points
         - Use <strong> for important text
         - Use <em> for emphasis
         - Use <br> for line breaks
         - Ensure all HTML tags are properly closed
         - Do not use markdown syntax (** or *)
         - Make sure the output is valid HTML"""),
        ("user", "{input}")
    ])
    
    final_chain = final_prompt | llm
    final_summary = final_chain.invoke({"input": final_combined_summary})
    
    return final_summary.content

@app.route('/summarize', methods=['POST'])
def summarize():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        original_text = data.get("originalText")
        if not original_text:
            return jsonify({"error": "Missing 'originalText' field"}), 400

        summarized_text = summarize_video_pipeline(original_text)
        return jsonify({
            "summarizedText": summarized_text,
            "status": "success"
        })

    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500
    
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

        try:
            transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
            transcript_text = " ".join([t['text'] for t in transcript_list])
        
        except Exception as e:
            return jsonify({"error": f"Transcript fetch failed: {str(e)}"}), 500

        summarized_text = summarize_video_pipeline(transcript_text)
        return jsonify({
            "summarizedText": summarized_text,
            "status": "success"
        })

    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@app.route('/answer-question', methods=['POST'])
def answer_question():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        summary = data.get("summary")
        question = data.get("question")
        
        if not summary or not question:
            return jsonify({"error": "Missing 'summary' or 'question' field"}), 400

        llm = ChatGroq(model="Gemma2-9b-It", temperature=0.7)
        parser = JsonOutputParser(pydantic_object=QuestionAnswer)
        
        prompt = PromptTemplate(
            template="""
            You are a comprehensive AI assistant that provides accurate and detailed answers to questions.
            Your goal is to be as helpful and accurate as possible, similar to ChatGPT.
            
            Guidelines:
            1. For any question:
               - First, check if the answer can be found in the provided summary
               - Then, use your broad knowledge base to provide additional context
               - Ensure all factual information is accurate and up-to-date
               - If you're not certain about something, say so
               - Provide detailed explanations when relevant
            
            2. For factual questions:
               - Provide specific details, dates, and statistics when available
               - If the information isn't in the summary, use your knowledge to provide accurate information
               - Double-check facts before stating them
               - If you're unsure about specific details, say so
            
            3. For general knowledge questions:
               - Provide comprehensive answers
               - Include relevant context and background information
               - Explain concepts clearly
               - Use examples when helpful
            
            4. For questions about the summary:
               - Quote relevant parts of the summary
               - Provide additional context from your knowledge
               - Explain connections between the summary and broader topics
            
            5. Always:
               - Be clear and detailed in your responses
               - Provide accurate information
               - Admit when you're uncertain
               - Use proper formatting for clarity
            
            Summary:
            {summary}
            
            Question:
            {question}
            
            {format_instructions}
            """,
            input_variables=["summary", "question"],
            partial_variables={
                "format_instructions": parser.get_format_instructions()
            },
        )
        
        chain = prompt | llm | parser
        result = chain.invoke({"summary": summary, "question": question})
        
        return jsonify({
            "answer": result["answer"],
            "status": "success"
        })

    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@app.route('/detect-fake-news', methods=['POST'])
def detect_fake_news():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        text = data.get("text")
        if not text:
            return jsonify({"error": "Missing 'text' field"}), 400

        llm = ChatGroq(model="Gemma2-9b-It", temperature=0.3)
        parser = JsonOutputParser(pydantic_object=FakeNewsAnalysis)
        
        prompt = PromptTemplate(
            template="""
            You are an expert fact-checker and fake news detector with access to current information up to April 2025. 
            Analyze the following news content and determine if it's likely fake or not.
            
            Guidelines:
            1. Check for:
               - Sensational or exaggerated claims
               - Lack of credible sources
               - Logical inconsistencies
               - Emotional manipulation
               - Unusual patterns in the text
               - Claims that contradict established facts
               - Claims about future events that are impossible to verify
               - Claims about past events that contradict known facts
               - Specific factual claims about recent events (e.g., sports match results, election outcomes)
               - Claims that can be verified against official records or recent news
            
            2. Consider:
               - The tone and language used
               - The presence of verifiable facts
               - The credibility of sources mentioned
               - The overall plausibility of claims
               - Current events and recent developments
               - The timeline of events mentioned
               - Official records and recent news reports
               - Factual claims that can be cross-verified
            
            3. For current events (2025):
               - Verify against known facts and recent developments
               - Consider the possibility of breaking news
               - Be cautious about definitive statements about future events
               - Acknowledge uncertainty when appropriate
               - Cross-reference with official sources for recent events
               - Pay special attention to verifiable facts (match results, scores, dates)
            
            4. For factual claims:
               - If a specific claim can be verified (e.g., match result), state this clearly
               - Provide the correct information if the claim is false
               - Explain why the claim is false with specific evidence
               - Consider the timing of the event in relation to the claim
            
            5. Provide:
               - A clear determination of whether the news is likely fake
               - A confidence score (0-1)
               - Specific reasons supporting your analysis
               - Suggestions for fact-checking
               - Clarification about any temporal aspects of the claims
               - Correct information if a false claim is detected
            
            News content:
            {text}
            
            {format_instructions}
            """,
            input_variables=["text"],
            partial_variables={
                "format_instructions": parser.get_format_instructions()
            },
        )
        
        chain = prompt | llm | parser
        result = chain.invoke({"text": text})
        
        return jsonify({
            "analysis": result,
            "status": "success"
        })

    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)