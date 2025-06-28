import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { useSocket } from '../../hooks/useSocket';
import { Poll, PollResults, ChatMessage } from '../../types';
import { getStudentId, setStudentId, getStudentName, setStudentName, generateStudentId } from '../../utils/storage';
import { PollResultsView } from '../../components/PollResultsView';
import { ChatWidget } from '../../components/ChatWidget';
import { ArrowLeft, Clock, MessageCircle, AlertCircle, User, Brain, CheckCircle, Star, Zap, Trophy, Sparkles } from 'lucide-react';

interface StudentDashboardProps {
  onBack: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onBack }) => {
  const [studentName, setStudentNameState] = useState('');
  const [isNameSet, setIsNameSet] = useState(false);
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [hasAnswered, setHasAnswered] = useState(false);
  const [pollResults, setPollResults] = useState<PollResults | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isKicked, setIsKicked] = useState(false);
  const [pollEnded, setPollEnded] = useState(false);

  const socket = useSocket();

  useEffect(() => {
    // Check if student name is already set in session storage
    const existingName = getStudentName();
    const existingId = getStudentId();
    
    if (existingName && existingId) {
      setStudentNameState(existingName);
      setIsNameSet(true);
    }
  }, []);

  useEffect(() => {
    if (!socket || !isNameSet) return;

    let studentId = getStudentId();
    if (!studentId) {
      studentId = generateStudentId();
      setStudentId(studentId);
    }

    socket.emit('join-as-student', { studentId, name: studentName });

    socket.on('current-poll', (poll: Poll) => {
      console.log('Received current poll:', poll);
      setCurrentPoll(poll);
      setHasAnswered(poll.hasAnswered || false);
      setTimeLeft(poll.timeLimit);
      setSelectedAnswer('');
      setPollResults(null);
      setPollEnded(false);
    });

    socket.on('new-poll', (poll: Poll) => {
      console.log('Received new poll:', poll);
      setCurrentPoll(poll);
      setHasAnswered(false);
      setTimeLeft(poll.timeLimit);
      setSelectedAnswer('');
      setPollResults(null);
      setPollEnded(false);
    });

    socket.on('poll-results', (results: PollResults) => {
      console.log('Received poll results:', results);
      setPollResults(results);
    });

    socket.on('poll-ended', (results: PollResults) => {
      console.log('Poll ended with results:', results);
      setPollResults(results);
      setCurrentPoll(null); // Clear current poll when it ends
      setTimeLeft(0);
      setPollEnded(true);
      
      // Show ended message for a few seconds then clear
      setTimeout(() => {
        setPollEnded(false);
        setPollResults(null);
      }, 5000);
    });

    socket.on('chat-history', (messages: ChatMessage[]) => {
      setChatMessages(messages);
    });

    socket.on('new-message', (message: ChatMessage) => {
      setChatMessages(prev => [...prev, message]);
      if (!showChat && message.senderType === 'teacher') {
        setUnreadMessages(prev => prev + 1);
      }
    });

    socket.on('kicked', () => {
      setIsKicked(true);
    });

    return () => {
      socket.off('current-poll');
      socket.off('new-poll');
      socket.off('poll-results');
      socket.off('poll-ended');
      socket.off('chat-history');
      socket.off('new-message');
      socket.off('kicked');
    };
  }, [socket, isNameSet, studentName, showChat]);

  // Timer effect
  useEffect(() => {
    if (currentPoll && timeLeft > 0 && !hasAnswered) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up - show results
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentPoll, timeLeft, hasAnswered]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentName.trim()) {
      setStudentName(studentName.trim());
      setIsNameSet(true);
    }
  };

  const handleAnswerSubmit = () => {
    if (socket && selectedAnswer && currentPoll) {
      socket.emit('submit-answer', { answer: selectedAnswer });
      setHasAnswered(true);
    }
  };

  const handleSendMessage = (text: string) => {
    if (socket) {
      socket.emit('send-message', {
        text,
        sender: studentName,
        senderType: 'student'
      });
    }
  };

  const handleChatToggle = () => {
    setShowChat(!showChat);
    if (!showChat) {
      setUnreadMessages(0);
    }
  };

  if (isKicked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 via-pink-100 to-orange-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-300/30 to-pink-300/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-300/30 to-red-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-white/30 shadow-2xl relative z-10 border-4 border-red-200">
          <CardContent className="text-center py-8">
            <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-4 animate-bounce" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Oops! You've been removed 😔</h2>
            <p className="text-gray-600 mb-4 text-lg">You have been removed from the session by the teacher.</p>
            <Button onClick={onBack} className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-xl px-8 py-3 rounded-2xl font-bold">
              🏠 Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isNameSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-60 animate-bounce"></div>
          <div className="absolute top-40 right-32 w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rotate-45 opacity-70 animate-pulse"></div>
          <div className="absolute bottom-32 left-40 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-50 animate-bounce delay-1000"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-300/30 to-purple-300/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-300/30 to-blue-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <Card className="w-full max-w-lg bg-white/90 backdrop-blur-sm border-white/30 shadow-2xl relative z-10 border-4 border-blue-200 rounded-3xl">
          <CardHeader className="text-center bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-t-3xl border-b-4 border-blue-200">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-xl">
              <User className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-black flex items-center justify-center gap-2">
              <Star className="w-8 h-8 text-yellow-500 animate-spin" />
              Welcome, Future Quiz Champion!
              <Star className="w-8 h-8 text-yellow-500 animate-spin" />
            </CardTitle>
            <p className="text-gray-600 text-lg font-semibold">🎯 Enter your name to join the fun!</p>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleNameSubmit} className="space-y-6">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="What's your awesome name? 😊"
                  value={studentName}
                  onChange={(e) => setStudentNameState(e.target.value)}
                  className="w-full text-xl p-6 bg-white/80 border-4 border-blue-200 focus:border-purple-400 focus:ring-purple-300 rounded-2xl font-semibold text-center"
                  required
                />
                <Sparkles className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-purple-500 animate-pulse" />
              </div>
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-white/80 border-4 border-gray-200 hover:bg-gray-50 text-lg py-4 rounded-2xl font-bold">
                  ← Back
                </Button>
                <Button type="submit" className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-xl py-4 rounded-2xl font-bold border-4 border-white/30">
                  <Zap className="w-6 h-6 mr-2" />
                  Join the Fun! 🚀
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-cyan-100 to-purple-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-40 right-32 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rotate-45 opacity-70 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-40 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
        <div className="absolute top-60 left-1/3 w-8 h-8 bg-gradient-to-r from-red-400 to-yellow-500 rotate-12 opacity-60 animate-spin" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-40 right-20 w-14 h-14 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-300/30 to-blue-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-300/30 to-purple-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-200/20 to-green-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border-4 border-white/40 hover:bg-white/95 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-2xl px-6 py-3 font-bold"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </Button>
              <div className="space-y-1">
                <h1 className="text-5xl font-black bg-gradient-to-r from-green-500 via-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                  <Brain className="w-12 h-12 text-green-500 animate-pulse" />
                  Student Zone
                  <Star className="w-10 h-10 text-yellow-500 animate-spin" />
                </h1>
                <p className="text-gray-700 text-xl font-bold">Hey there, <span className="text-blue-600 bg-yellow-200 px-3 py-1 rounded-full">{studentName}</span>! Ready to rock this quiz? 🎸</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={handleChatToggle}
              className="relative flex items-center gap-2 bg-white/90 backdrop-blur-sm border-4 border-white/40 hover:bg-white/95 transition-all duration-300 shadow-xl hover:shadow-2xl rounded-2xl px-6 py-3 font-bold"
            >
              <MessageCircle className="w-5 h-5" />
              Chat 💬
              {unreadMessages > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm px-2 min-w-[24px] h-6 flex items-center justify-center rounded-full animate-bounce border-2 border-white">
                  {unreadMessages}
                </Badge>
              )}
            </Button>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Poll Ended Message */}
            {pollEnded && (
              <Card className="bg-gradient-to-r from-orange-200 to-red-200 border-4 border-orange-300 shadow-2xl animate-fadeIn rounded-3xl">
                <CardContent className="text-center py-8">
                  <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center animate-bounce shadow-xl">
                    <span className="text-6xl">🏁</span>
                  </div>
                  <h3 className="text-3xl font-black text-orange-800 mb-2">Quiz Finished! 🎉</h3>
                  <p className="text-orange-700 text-xl font-bold">The teacher has ended the quiz. Check out those awesome results below! 📊</p>
                </CardContent>
              </Card>
            )}

            {currentPoll ? (
              <Card className="bg-white/90 backdrop-blur-sm border-4 border-white/40 shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-3xl">
                <CardHeader className="bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-t-3xl border-b-4 border-blue-200">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl flex items-center gap-3 font-black">
                      <Trophy className="w-8 h-8 text-yellow-500 animate-bounce" />
                      Current Quiz Challenge
                      <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white animate-pulse text-lg px-4 py-2 rounded-full border-2 border-white">
                        🔥 LIVE
                      </Badge>
                    </CardTitle>
                    {timeLeft > 0 && !hasAnswered && (
                      <Badge variant="destructive" className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 animate-pulse text-xl px-4 py-2 rounded-full border-2 border-white font-black">
                        <Clock className="w-5 h-5" />
                        ⏰ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-8">
                    <h3 className="text-3xl font-black text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-center p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl border-4 border-blue-200">
                      🤔 {currentPoll.question}
                    </h3>
                    
                    {!hasAnswered && timeLeft > 0 ? (
                      <div className="space-y-6">
                        <div className="grid gap-4">
                          {currentPoll.options.map((option, index) => (
                            <label
                              key={index}
                              className={`flex items-center p-6 border-4 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 font-bold text-lg ${
                                selectedAnswer === option
                                  ? 'border-blue-500 bg-gradient-to-r from-blue-100 to-purple-100 shadow-2xl scale-105'
                                  : 'border-gray-300 hover:border-blue-400 bg-white/80 hover:bg-white/95 shadow-lg hover:shadow-xl'
                              }`}
                            >
                              <input
                                type="radio"
                                name="poll-answer"
                                value={option}
                                checked={selectedAnswer === option}
                                onChange={(e) => setSelectedAnswer(e.target.value)}
                                className="mr-6 w-6 h-6 text-blue-600"
                              />
                              <span className="text-xl font-bold flex items-center gap-3">
                                <span className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-black">
                                  {String.fromCharCode(65 + index)}
                                </span>
                                {option}
                              </span>
                            </label>
                          ))}
                        </div>
                        
                        <Button
                          onClick={handleAnswerSubmit}
                          disabled={!selectedAnswer}
                          className="w-full py-6 text-2xl bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 rounded-2xl font-black border-4 border-white/50"
                        >
                          <Zap className="w-8 h-8 mr-3 animate-pulse" />
                          Submit My Answer! 🚀
                          <Star className="w-8 h-8 ml-3 animate-spin" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        {hasAnswered ? (
                          <div className="space-y-6">
                            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center animate-bounce shadow-2xl">
                              <CheckCircle className="w-16 h-16 text-white" />
                            </div>
                            <p className="text-green-600 font-black text-3xl">Awesome! Answer submitted! 🎉</p>
                            <p className="text-gray-600 text-xl font-bold">Waiting for the results... This is so exciting! 🤩</p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-red-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-2xl">
                              <span className="text-6xl">⏰</span>
                            </div>
                            <p className="text-red-600 font-black text-3xl">Time's up! ⏰</p>
                            <p className="text-gray-600 text-xl font-bold">Don't worry, let's see how everyone did! 📊</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/90 backdrop-blur-sm border-4 border-white/40 shadow-2xl rounded-3xl">
                <CardContent className="text-center py-20">
                  <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-r from-gray-200 to-blue-200 rounded-full flex items-center justify-center animate-pulse shadow-xl">
                    <span className="text-8xl">📊</span>
                  </div>
                  <h3 className="text-4xl font-black text-gray-900 mb-4">No Quiz Yet! 🤔</h3>
                  <p className="text-gray-600 text-2xl font-bold">Waiting for your teacher to start an awesome quiz... Get ready! 🚀</p>
                  <div className="flex justify-center gap-2 mt-6">
                    <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
                    <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Poll Results */}
            {pollResults && (
              <div className="animate-fadeIn">
                <PollResultsView results={pollResults} />
              </div>
            )}
          </div>

          {/* Chat Widget */}
          {showChat && (
            <ChatWidget
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              onClose={handleChatToggle}
              userType="student"
              userName={studentName}
            />
          )}
        </div>
      </div>
    </div>
  );
};