from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
from langchain_groq import ChatGroq
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate, ChatPromptTemplate
from langchain_core.pydantic_v1 import BaseModel, Field


class Summary(BaseModel):
    summary: str = Field(description="The generated summary")

app = Flask(__name__)

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
        ("system", """You are a formatting assistant. Format this summary with:
         - Clear headings
         - Bullet points for key items
         - Paragraphs for longer explanations
         - Proper HTML tags (<h2>, <p>, <ul>, <li>, <br>)
         - No JSON formatting"""),
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

if __name__ == '__main__':
    app.run(debug=True, port=5001)