# 🧠 Inquizitive – Real-time Classroom Polling App

[🌐 Live Demo](https://inquizitive-7.vercel.app/) • [📂 GitHub Repo](https://github.com/TanmaySingh007/Inquizitive)

Inquizitive is a real-time, interactive classroom polling platform built with **React + TypeScript**, **Express + TypeScript**, and **Socket.IO**. Teachers can ask live questions, and students can respond in real time—with a smooth and responsive UI.

---

## ✨ Features

### 👩‍🏫 Teacher
- Create and send live poll questions
- View live poll results as students respond
- Enforced rule: new question only allowed when the previous one is closed
- Poll auto-ends after all students answer or 60 seconds pass

### 👨‍🎓 Student
- Join using a tab-unique name (stored in session only)
- Submit a response once a poll is live
- View real-time results after submitting or timeout
- Auto-submission not required—poll closes regardless after 60s

---

## 🧱 Tech Stack

| Layer       | Tech                                 |
|-------------|--------------------------------------|
| Frontend    | React.js, **TypeScript**, Tailwind CSS, React Router |
| Backend     | Node.js, Express.js, **TypeScript**  |
| Real-time   | Socket.IO                            |
| Deployment  | Vercel (Frontend), Render (Backend)  |

---

## 📦 Project Structure

```bash
/Inquizitive
│
├── /client             # React + TypeScript frontend
│   └── /src
│       ├── components/ # Student and Teacher views
│       ├── socket.ts   # Socket.IO client setup
│       └── ...
│
├── /server             # Express + TypeScript backend
│   ├── index.ts        # Entry point
│   ├── types/          # Shared interfaces
│   └── socket.ts       # Socket.IO server logic
│
└── README.md
```

---

## 🚀 Getting Started

### 1️⃣ Clone the repo

```bash
git clone https://github.com/TanmaySingh007/Inquizitive
cd Inquizitive
```

### 2️⃣ Setup Backend (Express + TS)

```bash
cd server
npm install
npm run dev    # Uses ts-node-dev
```

> 📍 Runs on `http://localhost:5000`

### 3️⃣ Setup Frontend (React + TS)

```bash
cd client
npm install
npm run dev    # or npm start depending on your setup
```

> 📍 Opens `http://localhost:3000`

---

## 🧪 Local Usage

| Role     | Path                    | Description                    |
|----------|-------------------------|--------------------------------|
| Teacher  | `/teacher`              | Create and manage polls        |
| Student  | `/student`              | Join, answer, view results     |

---

## 🧠 Logic Summary

- When teacher posts a question → it's broadcasted via Socket.IO
- Student receives the question and submits an answer
- Server tracks answers per socket ID
- After 60 seconds or all students answer → `poll-ended` event is fired
- All clients receive live results during and after the poll

---

## 📸 Screenshots

> _Add images in `/screenshots` folder and reference here_

---

## 📌 Future Enhancements

- [ ] MongoDB/PostgreSQL support for persistent poll data
- [ ] Student kick/ban system
- [ ] Teacher chat broadcast
- [ ] Configurable poll duration
- [ ] Mobile-first responsive design

---

## 🔗 Useful Links

- 🖼 [Figma UI Inspiration](https://www.figma.com/design/uhinheFgWssbxvlI7wtf59/Intervue-Assigment--Poll-system?node-id=0-1&t=Y5GfjIgQte8VUTgA-1)
- 🧠 [Socket.IO Docs](https://socket.io/docs/)

---

## 🙋 Author

Made with 💡 by [Tanmay Singh](https://github.com/TanmaySingh007)  
🔗 Feel free to fork, star, or contribute!
```

