# Querio Connect - System Architecture & Tech Stack

**Querio Connect** is a full-stack, multilingual university communication platform originally built for SRMIST. Its main goal is to bridge the communication gap between students and the institution by providing a centralized dashboard for notices, FAQs, and a highly intelligent, real-time AI assistant that can speak multiple regional languages.

Here is a detailed breakdown of the complete project architecture and tech stack. **There are no "fake" or mocked technologies here; every piece of this stack is fully implemented and functioning locally.**

---

### 1. The Frontend (Client-Side)
The frontend is designed to be a snappy, responsive Single Page Application (SPA) with a corporate and minimal UI.
- **Framework:** **React 18** built with **Vite** for lightning-fast hot reloading and optimized production builds.
- **Language:** **TypeScript** for strict type safety and fewer runtime errors.
- **Styling:** **Tailwind CSS** combined with **shadcn/ui** (built on top of Radix UI). This provides highly accessible, customizable, and beautifully animated UI components (like dropdowns, accordions, and modals).
- **State Management & Data Fetching:** **TanStack React Query**. This handles caching, background updates, and loading states automatically whenever the frontend requests data (like Notices or FAQs) from the backend.
- **Multilingual UI (i18n):** The entire UI utilizes a custom React `LanguageContext`. By selecting a language from the top-right dropdown, the entire application (buttons, menus, placeholders) instantly translates between **English, Hindi, Tamil, and Telugu**.

### 2. The Backend (Server-Side)
The backend acts as the secure middleman, handling business logic, authenticating users, and communicating with the database and AI.
- **Framework:** **Node.js** with **Express.js**.
- **Authentication:** **JWT (JSON Web Tokens)**. When a student logs in, the server generates an encrypted token. The frontend stores this token and attaches it to every subsequent API request to prove the user's identity. Passwords are securely hashed in the database using **bcryptjs**.
- **RESTful API:** The Express server exposes clean endpoints like `GET /api/notices`, `POST /api/auth/register`, and `POST /api/chat/message`.

### 3. The Database (Data Layer)
The data layer ensures that all users, notices, FAQs, and chat histories are permanently saved.
- **Database Engine:** **SQLite**. It is configured as a local `.db` file, which is incredibly fast and requires zero setup for local development. 
- **ORM (Object-Relational Mapper):** **Prisma (v5)**. Instead of writing raw SQL queries, Prisma allows us to interact with the database using clean JavaScript/TypeScript objects. It also guarantees that our database schemas (like the `User` and `ChatSession` tables) strictly match our code.

### 4. The AI Engine (Google Gemini)
The crown jewel of the project is the dynamic AI assistant, moving far beyond a traditional "chatbot".
- **Model:** **Gemini 2.5 Flash** via the `@google/generative-ai` SDK.
- **RAG (Retrieval-Augmented Generation):** The system uses a powerful concept called Context Injection. Whenever a user sends a message, the backend intercepts it, pulls the latest official **Notices** and **FAQs** from the SQLite database, and secretly feeds them to Gemini as "System Instructions." 
- **The Result:** The AI doesn't just guess answers; it provides factually accurate information strictly based on SRMIST's current data. If a student asks *"When is the registration deadline?"* in Tamil, Gemini reads the English database notice, understands the context, and replies dynamically in Tamil.

---

### How the Flow Works
1. A student logs in and navigates to the Chat interface.
2. They type: *"How much is the hostel fee?"*
3. The React frontend sends a `POST` request to the Node.js backend.
4. The backend queries the SQLite database for the student's chat history, as well as the latest FAQs.
5. The backend packages the question, the history, and the FAQs, and sends them to the Google Gemini API.
6. Gemini reads the FAQ data, formulates a helpful response, and sends it back to the Node.js server.
7. The server saves Gemini's response to the SQLite database so the history is permanently preserved.
8. The server forwards the response to the React frontend, which displays the message to the student.
