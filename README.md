![github-submission-banner](https://github.com/user-attachments/assets/a1493b84-e4e2-456e-a791-ce35ee2bcf2f)

# 🚀 Project Title

> Focus on what matters — AI-powered news summaries with BriefLens

---

## 📌 Problem Statement

Problem Statement 1- Weave AI magic with Groq.



---

## 🎯 Objective

**BriefLens** is an **AI-powered** platform that delivers concise news **summaries** from **video**, **audio**, and **text** formats, helping **busy professionals**, **journalists**, **students**, and the **public** quickly grasp key insights. Key features include a **daily live news feed**, interactive **cross-questioning** with **AI**, and **fake news detection** to ensure content **authenticity**.



---

## 🧠 Team & Approach

### Team Name:  
`HackCity Boys`

### Team Members:  
- Lakshay Bajaj (https://github.com/LAKSHAY2100 / AI Developer)  
- Rishuraj Pandey (https://github.com/RishurajPandey / Frontend Developer) 
- Kanavpreet Singh (https://github.com/Kanavpreet-Singh / Backend developer)  


### Our Approach:  
- We chose this problem because news consumption today is time-consuming and fragmented, with valuable information buried in long videos, podcasts, or lengthy articles. In a fast-paced world, people often don’t have the time to stay fully informed. By building **BriefLens**, we aimed to simplify how people consume news—making it faster, smarter, and more accessible through AI-powered summarization of content across video, audio, and text formats. Alongside concise summaries, BriefLens offers a daily live news feed like a digital newspaper, interactive cross-questioning with the AI to satisfy user curiosity, and an integrated fake news detection system to ensure the authenticity and reliability of every piece of news.

- Key challenges: 
    - Handling and processing multiple input formats (text, audio, video) seamlessly. 
    - Integrating smart Q/A system after user obtains the summary.
    - Checking whether or not the news is fake. 
    - Achieving high transcription accuracy from varied audio/video sources.  
    - Generating summaries that preserve context and key information.  
    - Optimizing performance for fast, real-time responses using Groq.  
    - Connecting backend with Summarization models through Flask APIs. 
- Brainstorms: 
    - Learning to build news summarization model using Groq.
    - Figuring out way to connect it with NodeJs Backend.
    - Exploring various designs for frontend designing.
    - Transcribing news from video and audio inputs to text.
    - Building live digital newspaer, fake detection system for every news

---

## 🛠️ Tech Stack

### Core Technologies Used:
- Frontend: React, TailwindCSS
- Backend: NodeJs, Flask
- Database: MongoDB
- APIs: Groq, AssemblyAI, Gnews


### Sponsor Technologies Used:
- ✅ **Groq:** We used Groq's high-speed LLM inference to generate summaries from processed text. Whether the input was text, audio, or video (converted to text), Groq delivered fast, accurate, and context-aware news summaries. Additionally, Groq was utilized for **fake news detection** and for **responding to users' questions** related to news articles and summaries, enabling an interactive and trustworthy news consumption experience.
 

---

## ✨ Key Features



- ✅ Summarize any English or Hindi news video from YouTube — just paste the URL and get a concise summary instantly. 
- ✅ Instantly and accurately summarize any audio news file.  
- ✅ Effectively summarize long news articles to save time and reading effort. 
- ✅ **Fake News Detection:** After summarizing, the system checks whether the news is real or fake using AI verification.
- ✅ **Interactive Q&A:** Ask questions related to the summary or even beyond it, and get accurate, instant answers powered by Groq.
- ✅ **Daily Live News Feed:** Access a real-time stream of daily news with images, short descriptions, and direct links to full articles on the web.

- ✅ Enhanced UI with dark/light mode, website responsiveness and easy access to previously viewed summaries. 



---

## 📽️ Demo & Deliverables

- **Demo Video Link:** (https://youtu.be/Hwiuqds9eFo) 
- **Pitch Deck / PPT Link:** https://www.canva.com/design/DAGldy7Um8Q/CmFE5grHb7iJ9NWNKsJloQ/view?utm_content=DAGldy7Um8Q&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=he74d13336f

---

## ✅ Tasks & Bonus Checklist

- [✅] **All members of the team completed the mandatory task - Followed at least 2 of our social channels and filled the form** (Details in Participant Manual)  
- [ ] **All members of the team completed Bonus Task 1 - Sharing of Badges and filled the form (2 points)**  (Details in Participant Manual)
- [ ] **All members of the team completed Bonus Task 2 - Signing up for Sprint.dev and filled the form (3 points)**  (Details in Participant Manual)

*(Mark with ✅ if completed)*

---
## 🧪 How to Run the Project

### Requirements:
- Node.js and npm
- Python 3.x
- MongoDB Atlas account
- API keys from:
  - [Groq](https://groq.com/)
  - [AssemblyAI](https://www.assemblyai.com/)
  - [GNews](https://gnews.io/)
- `.env` file setup

### Local Setup:

1. **Clone the repository**
   ```bash
   git clone https://github.com/RishurajPandey/GroqHackathon.git

2. **Frontend Setup**
    ```bash
    cd frontned
    npm install
    npm run dev
3. **Backend Setup**
    ```bash
    cd ..
    pip install -r requirement.txt
    cd backend

    
    npm install

Create a .env file in the backend directory with the following content:
    
    JWT_SECRET=your_jwt_secret
    MONGO_URL=your_mongodb_connection_url
    GROQ_API_KEY=your_groq_api_key
    ASSEMBLYAI_API_KEY=your_assemblyai_api_key
    GNEWS_API_KEY=your_gnews_api_key
Start the backend server
    
    nodemon server.js
Run the Python service (in a new terminal, still inside the backend directory):

    python app.py

## 🧬 Future Scope

- **Personalized News Subscriptions**: Introduce a feature where users can subscribe to news categories or topics of their interest, with AI recommendations for tailored content.

- **Deployment and Scalability**: Deploy the application on cloud platforms like AWS or GCP, ensuring scalability and performance optimization through containerization (e.g., Docker) and orchestration (e.g., Kubernetes).

- **Voice-based Interaction**: Integrate voice recognition to allow users to listen to news summaries or ask questions using natural language voice commands, improving accessibility.


---

## 📎 Resources / Credits

- [JWT (JSON Web Token)](https://jwt.io/) – for implementing secure user authentication.
- [Groq](https://groq.com/) – used for fast and efficient language model-based news summarization.
- [AssemblyAI](https://www.assemblyai.com/) – for converting speech to text in audio news content.
- [Flask](https://flask.palletsprojects.com/) – lightweight Python framework used to connect the Groq LLM model with the backend.
- [Node.js](https://nodejs.org/) – backend environment handling API logic and server-side operations.
- [React](https://reactjs.org/) – JavaScript library used for building the user interface.
- [Tailwind CSS](https://tailwindcss.com/) – utility-first CSS framework for responsive frontend design.  

---

## 🏁 Final Words


Participating in the HackHazards Hackathon was an incredible experience full of challenges, learning, and fun moments. The most exciting part was when our feature finally started working properly after hours of debugging and iteration. Shoutout to my amazing teammates for their dedication and collaboration, and to the organizers for creating such a great platform. We regularly had Google Meet sessions to discuss new features, assign tasks, and track our progress, which kept the momentum going. It was a great team effort, and I walked away with a wealth of new knowledge and a deep sense of accomplishment.

---
