def summarize_video_pipeline():
    import validators
    from langchain_core.prompts import PromptTemplate
    from langchain_groq import ChatGroq
    from langchain.chains.summarize import load_summarize_chain
    from langchain_community.document_loaders import YoutubeLoader,UnstructuredURLLoader
    from youtube_transcript_api import YouTubeTranscriptApi
    from langchain.schema import Document

    import os
    from dotenv import load_dotenv
    load_dotenv()
    os.environ["GROQ_API_KEY"]=os.getenv("GROQ_API_KEY")

    llm = ChatGroq(model="llama-3.3-70b-versatile")

    from langchain_core.output_parsers import JsonOutputParser
    from langchain_core.prompts import PromptTemplate

    output_parser=JsonOutputParser()
    prompt = PromptTemplate(
        template="""
        Please analyze the video, create a summary, and provide a clickable index to its major contents.
        \n{format_instructions}\n. Content :{text}\n""",
        input_variables=["text"],
        partial_variables={"format_instructions": output_parser.get_format_instructions()},
    )

    def extract_video_id(url):
        if "youtube.com/watch?v=" in url:
            return url.split("v=")[1].split("&")[0]
        elif "youtu.be/" in url:
            return url.split("youtu.be/")[1].split("?")[0]
        else:
            return None

    # Input from user
    url = input("Enter a YouTube URL: ")

    # Validate and process
    if validators.url(url):
        video_id = extract_video_id(url)
        if video_id:
            try:
                transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
                transcript_text = " ".join([t['text'] for t in transcript_list])
                document = Document(page_content=transcript_text)
                print("\n--- Transcript ---\n")
                print(document.page_content)
            except Exception as e:
                print("Error fetching transcript:", e)
        else:
            print("Invalid YouTube URL format.")
    else:
        print("Not a valid URL.")

    from langchain.text_splitter import RecursiveCharacterTextSplitter
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=100 , chunk_overlap=20)
    documents =text_splitter.split_documents(documents=[document])
    documents

    from langchain_core.output_parsers import JsonOutputParser
    from langchain_core.prompts import PromptTemplate

    prompt = PromptTemplate(
        template="""
        Provide the summary of the provided chunk. Think  step by step before providing a detailed answer.Summarize the following chunk in a clear, concise, and informative way. Maintain important facts and avoid repetition.
        \n{documents}\n{query}\n""",
        input_variables=["query","documents"],
    )

    chain =prompt|llm
    def summarize_chunk(chunk):
        text=chain.invoke({"query":"give the summary","documents":{chunk}})
        return text
    partial_summaries = [summarize_chunk(c.page_content) for c in documents]
    final_combined_summary = " ".join(item.content for item in partial_summaries)
    from langchain_core.prompts import ChatPromptTemplate
    prompt2=ChatPromptTemplate.from_messages(
        [
            ("system","give the summary of the following text. Use proper headings, subheadings, bullet points , paragraphs where appropriate.Use HTML tags to format the text. Use a clear and concise writing style.For new line use <br> tag. "),
            ("user","{input}")
        ]
    )
    chain2=prompt2|llm 
    def summarize_combined_summary(combined_summary):
        text=chain2.invoke({"input":{combined_summary}})
        return text
    final_summary = summarize_combined_summary(final_combined_summary) 

    return final_summary.content



