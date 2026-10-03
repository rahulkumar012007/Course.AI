# 📚 Course.AI — AI-Powered Study Assistant

A full-stack web application that helps students study smarter using AI. Upload your PDF documents and interact with an AI tutor for Q&A, concept extraction, and auto-generated quizzes.

---

## 🌟 Features

- 📄 **PDF Upload** — Upload study material (PDF format, up to 10MB)
- 🤖 **AI Chat** — Ask questions about your document and get instant answers
- 📝 **Auto Summary** — AI generates a clear summary with key points on upload
- 🧠 **Quiz Generation** — Auto-generate MCQ quizzes from your document
- 🔐 **Authentication** — Secure register/login with JWT tokens
- 💾 **Chat History** — Conversation history saved per document

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React.js | UI Framework |
| Redux | State Management |
| Tailwind CSS | Styling |
| React Router | Navigation |
| Axios | API Calls |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT + bcrypt | Authentication |
| Multer | File Upload |
| pdf-parse | PDF Text Extraction |

### AI & Cloud
| Technology | Purpose |
|------------|---------|
| Groq API (LLaMA) | AI Chat & Summary |
| Cloudinary | File Storage |

---

## 📁 Project Structure

```
Course.AI/
├── Backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── uploadController.js
│   │   ├── chatController.js
│   │   └── quizController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Document.js
│   │   ├── ChatHistory.js
│   │   └── Quiz.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── upload.js
│   │   ├── chat.js
│   │   └── quiz.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── uploads/
│   ├── .env
│   └── index.js
│
└── Frontend/
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   ├── FileUpload.jsx
        │   ├── ChatBox.jsx
        │   ├── Summary.jsx
        │   └── Quiz.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx
        │   └── StudyPage.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── services/
        │   └── api.js
        └── App.jsx
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Groq API key (free at groq.com)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/course-ai.git
cd course-ai
```

### 2. Backend Setup
```bash
cd Backend
npm install
```

Create `.env` file in Backend folder:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
```

Start backend:
```bash
nodemon index.js
```

### 3. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

## 🔌 API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Document Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload PDF document |
| GET | `/api/upload` | Get all documents |
| GET | `/api/upload/:id` | Get single document |

### Chat Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/message` | Send message to AI |
| GET | `/api/chat/:documentId` | Get chat history |

### Quiz Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/quiz/generate` | Generate MCQ quiz |

---

## 🔒 Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `PORT` | Backend server port (default: 5000) |
| `JWT_SECRET` | Secret key for JWT tokens |
| `GROQ_API_KEY` | Groq API key for AI features |

---

## 👨‍💻 Developer

**Rahul Kumar**
- B.Tech IT — University School of Information, Communication and Technology, Delhi (2022–2026)
- GitHub: [github.com/yourusername](https://github.com/yourusername)
- LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
