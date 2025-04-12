def summarize_video_pipeline():
    import os
    from dotenv import load_dotenv
    load_dotenv()
    os.environ["GROQ_API_KEY"]=os.getenv("GROQ_API_KEY")

    from langchain_groq import ChatGroq
    llm=ChatGroq(model="Gemma2-9b-It")
    llm

    from langchain_community.document_loaders import TextLoader

    loader=TextLoader('news.txt')
    text_documents =loader.load()

    from langchain.text_splitter import RecursiveCharacterTextSplitter
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=100 , chunk_overlap=20)
    documents =text_splitter.split_documents(text_documents)
    documents

    from langchain_core.output_parsers import JsonOutputParser
    from langchain_core.prompts import PromptTemplate

    output_parser=JsonOutputParser()
    prompt = PromptTemplate(
        template="""
        Provide the summary of the provided chunk. Think  step by step before providing a detailed answer.Summarize the following chunk in a clear, concise, and informative way. Maintain important facts and avoid repetition.
        \n{documents}\n{format_instructions}\n{query}\n""",
        input_variables=["query","documents"],
        partial_variables={"format_instructions": output_parser.get_format_instructions()},
    )


    chain =prompt|llm|output_parser
    def summarize_chunk(chunk):
        text=chain.invoke({"query":"give the summary","documents":{chunk}})
        return text

    partial_summaries = [summarize_chunk(c.page_content) for c in documents]

    final_combined_summary = " ".join(item['summary'] for item in partial_summaries)

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

    final_summary = summarize_combined_summary(final_combined_summary)  # Final summarization step

    return final_summary.content



