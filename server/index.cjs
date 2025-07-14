const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:4173", "https://inquizitive-7.vercel.app"],
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// In-memory storage (in production, use a database)
let currentPoll = null;
let students = new Map(); // studentId -> { name, socketId, hasAnswered }
let answers = new Map(); // answerId -> { studentId, answer, timestamp }
let pollHistory = [];
let chatMessages = [];

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Teacher joins
  socket.on('join-as-teacher', () => {
    socket.join('teachers');
    socket.emit('current-poll', currentPoll);
    socket.emit('students-list', Array.from(students.values()));
    socket.emit('chat-history', chatMessages);
    console.log('Teacher joined');
  });

  // Student joins
  socket.on('join-as-student', (data) => {
    const { studentId, name } = data;
    
    // Update or create student record
    students.set(studentId, {
      id: studentId,
      name,
      socketId: socket.id,
      hasAnswered: currentPoll ? answers.has(`${currentPoll.id}-${studentId}`) : false
    });

    socket.join('students');
    socket.studentId = studentId;
    
    // Send current poll if exists - ALWAYS show to students immediately
    if (currentPoll) {
      const hasAnswered = answers.has(`${currentPoll.id}-${studentId}`);
      socket.emit('current-poll', { ...currentPoll, hasAnswered });
    }
    
    socket.emit('chat-history', chatMessages);
    
    // Notify teachers about new student
    io.to('teachers').emit('students-list', Array.from(students.values()));
    
    console.log(`Student ${name} joined with ID: ${studentId}`);
  });

  // Teacher creates a new poll
  socket.on('create-poll', (pollData) => {
    console.log('Received create-poll request:', pollData);
    
    // Validate poll data
    if (!pollData.question || !pollData.options || pollData.options.length < 2) {
      console.error('Invalid poll data:', pollData);
      socket.emit('poll-error', { message: 'Invalid poll data' });
      return;
    }

    const pollId = uuidv4();
    currentPoll = {
      id: pollId,
      question: pollData.question,
      options: pollData.options,
      timeLimit: pollData.timeLimit || 60,
      createdAt: new Date(),
      isActive: true
    };

    console.log('Created new poll:', currentPoll);

    // Reset all students' answer status
    students.forEach((student, id) => {
      students.set(id, { ...student, hasAnswered: false });
    });

    // Clear previous answers for this poll
    answers.clear();

    // Broadcast to ALL students immediately - they should see the poll right away
    io.to('students').emit('new-poll', currentPoll);
    io.to('teachers').emit('poll-created', currentPoll);
    io.to('teachers').emit('students-list', Array.from(students.values()));

    console.log('Poll broadcasted to all clients');
  });

  // Student submits answer
  socket.on('submit-answer', (data) => {
    if (!currentPoll || !socket.studentId) return;

    const answerKey = `${currentPoll.id}-${socket.studentId}`;
    const student = students.get(socket.studentId);
    const answer = {
      studentId: socket.studentId,
      studentName: student?.name || 'Unknown',
      answer: data.answer,
      timestamp: new Date()
    };

    answers.set(answerKey, answer);

    // Update student's answered status
    if (student) {
      students.set(socket.studentId, { ...student, hasAnswered: true });
    }

    // Send updated results to everyone
    const results = calculateResults();
    io.emit('poll-results', results);
    io.to('teachers').emit('students-list', Array.from(students.values()));

    console.log(`Student ${answer.studentName} answered: ${data.answer}`);
  });

  // End poll (teacher)
  socket.on('end-poll', () => {
    if (currentPoll) {
      currentPoll.isActive = false;
      currentPoll.endedAt = new Date();
      
      // Calculate final results
      const results = calculateResults();
      
      // Only save to history if there were responses
      if (results && results.totalResponses > 0) {
        // Get detailed student responses for history
        const studentResponses = [];
        answers.forEach((answer, key) => {
          if (key.startsWith(currentPoll.id)) {
            studentResponses.push({
              studentId: answer.studentId,
              studentName: answer.studentName,
              answer: answer.answer,
              timestamp: answer.timestamp
            });
          }
        });

        // Save to history with proper structure including student details
        const historyEntry = {
          id: currentPoll.id,
          question: currentPoll.question,
          options: currentPoll.options,
          timeLimit: currentPoll.timeLimit,
          createdAt: currentPoll.createdAt,
          endedAt: currentPoll.endedAt,
          isActive: false,
          results: results.results,
          totalResponses: results.totalResponses,
          studentResponses: studentResponses // Add detailed student responses
        };

        pollHistory.push(historyEntry);
        console.log('Poll saved to history:', historyEntry);
        console.log('Current poll history length:', pollHistory.length);

        // Send updated history to all teachers
        io.to('teachers').emit('poll-history', pollHistory);
      } else {
        console.log('Poll ended without responses - not saving to history');
      }

      // Send final results and clear current poll - this will end it for students too
      io.emit('poll-ended', results);
      
      // Clear the current poll so students know it's ended
      currentPoll = null;
      
      console.log('Poll ended and cleared');
    }
  });

  // Get poll history
  socket.on('get-poll-history', () => {
    console.log('Sending poll history, length:', pollHistory.length);
    console.log('Poll history data:', pollHistory);
    socket.emit('poll-history', pollHistory);
  });

  // Chat functionality
  socket.on('send-message', (data) => {
    const message = {
      id: uuidv4(),
      text: data.text,
      sender: data.sender,
      senderType: data.senderType, // 'teacher' or 'student'
      timestamp: new Date()
    };

    chatMessages.push(message);
    io.emit('new-message', message);
  });

  // Kick student (teacher only)
  socket.on('kick-student', (studentId) => {
    const student = students.get(studentId);
    if (student) {
      io.to(student.socketId).emit('kicked');
      students.delete(studentId);
      io.to('teachers').emit('students-list', Array.from(students.values()));
      console.log(`Student ${student.name} was kicked`);
    }
  });

  socket.on('disconnect', () => {
    // Remove student from active list if they disconnect
    if (socket.studentId) {
      students.delete(socket.studentId);
      io.to('teachers').emit('students-list', Array.from(students.values()));
    }
    console.log('User disconnected:', socket.id);
  });
});

function calculateResults() {
  if (!currentPoll) return null;

  const results = {};
  currentPoll.options.forEach(option => {
    results[option] = 0;
  });

  answers.forEach(answer => {
    if (results.hasOwnProperty(answer.answer)) {
      results[answer.answer]++;
    }
  });

  return {
    pollId: currentPoll.id,
    question: currentPoll.question,
    results,
    totalResponses: answers.size,
    totalStudents: students.size
  };
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});