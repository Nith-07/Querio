# Querio Connect

Querio Connect is a full-stack, multilingual university query resolution platform designed to bridge communication gaps between students and institutions. Originally developed for SRMIST, it enables users to ask complex questions in multiple regional languages and receive highly accurate, context-aware responses powered by a live Gemini AI integration. 

Beyond AI chat, the platform provides an all-in-one centralized dashboard for students to access official university notices, browse frequently asked questions, and submit feedback directly to the administration.

---

## Features

- **Full-Stack Architecture:** A snappy React SPA powered by a robust Node.js/Express backend and a SQLite database.
- **Secure Authentication:** Real JWT (JSON Web Token) based login and registration with password hashing.
- **Multilingual UI:** Dynamic, global interface supporting English, Hindi, Tamil, and Telugu via React Context.
- **True AI Chatbot:** Integrated with the Google Gemini 2.5 Flash API. The backend automatically injects live database context (Notices & FAQs) into the prompt so the AI acts as a true university expert.
- **Persistent Chat History:** Conversations are saved securely to the database across sessions.
- **Notice & Announcement Board:** Expandable cards fetching real-time data from the backend.
- **FAQ Section:** Accordion layout pulling dynamic answers from the database.
- **Feedback & Rating System:** Users can submit feedback and star ratings directly to the backend.
- **Responsive Design:** Clean, corporate UI utilizing a Navy and White theme built with Tailwind CSS and shadcn/ui.

---

## Tech Overview

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express.js
- **Database:** SQLite with Prisma ORM
- **AI Engine:** Google Gemini 2.5 Flash API
- **State Management & Fetching:** TanStack React Query
- **Multi-language Support:** Dynamic UI language switching via React Context API

---

## Project Structure

The application follows a modern full-stack architecture.

### Main Sections

- **Landing Page:** Introduction to the platform.
- **Authentication:** Secure Login and Registration forms.
- **Dashboard:** The main hub containing:
  - **Chat Interface:** Communicate with the Gemini-powered assistant.
  - **Chat History:** Resume past conversations.
  - **Notices:** Read official university announcements.
  - **FAQ:** Browse categorized frequently asked questions.
  - **Feedback:** Submit platform feedback.

---

## Language Support

The platform includes a UI language selector that dynamically translates the entire user interface:

- Navigation and Menus
- Notices and Dashboard elements
- FAQ content
- The AI Assistant (Gemini responds naturally in the user's requested language)

---

## Getting Started

To run the project locally on your machine:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Create a `.env` file in the root directory and add your database URL and Gemini API Key:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   DATABASE_URL="file:./dev.db"
   ```

3. **Database Setup:**
   Generate the Prisma client and push the schema (if starting fresh):
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Start the development server:**
   Our setup uses `concurrently` to run both the frontend and backend at the same time with one command:
   ```bash
   npm run dev
   ```

5. **Access the App:**
   Open your browser and navigate to `http://localhost:8080` (or `8081` if the port is busy).

---

## Purpose

Querio was developed as part of a Software Engineering and Project Management project to demonstrate:

- Full-stack web application development
- Integration of Large Language Models (LLMs) with dynamic database context mapping (RAG architecture)
- Multilingual system design and dynamic UI routing
- Real-time data persistence and secure API design
