import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useSocket } from '../../hooks/useSocket';
import { Poll, Student, PollResults, PollHistory, ChatMessage } from '../../types';
import { CreatePollModal } from '../../components/CreatePollModal';
import { PollResultsView } from '../../components/PollResultsView';
import { StudentsList } from '../../components/StudentsList';
import { ChatWidget } from '../../components/ChatWidget';
import { PollHistoryView } from '../../components/PollHistoryView';
import { ArrowLeft, Plus, Users, BarChart3, History, MessageCircle, Brain, Star, Zap, Trophy, BookOpen } from 'lucide-react';

interface TeacherDashboardProps {
  onBack: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onBack }) => {
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [pollResults, setPollResults] = useState<PollResults | null>(null);
  const [pollHistory, setPollHistory] = useState<PollHistory[]>([]);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const socket = useSocket();

  useEffect(() => {
    if (!socket) {
      console.log('Socket not available yet');
      return;
    }

    console.log('Setting up socket listeners for teacher');
    socket.emit('join-as-teacher');

    socket.on('current-poll', (poll: Poll) => {
      console.log('Received current poll:', poll);
      setCurrentPoll(poll);
    });

    socket.on('students-list', (studentsList: Student[]) => {
      console.log('Received students list:', studentsList);
      setStudents(studentsList);
    });

    socket.on('poll-created', (poll: Poll) => {
      console.log('Poll created successfully:', poll);
      setCurrentPoll(poll);
      setPollResults(null);
    });

    socket.on('poll-results', (results: PollResults) => {
      console.log('Received poll results:', results);
      setPollResults(results);
    });

    socket.on('poll-ended', (results: PollResults) => {
      console.log('Poll ended:', results);
      setPollResults(results);
      setCurrentPoll(null);
      // Automatically refresh history when a poll ends
      if (socket) {
        socket.emit('get-poll-history');
      }
    });

    socket.on('poll-history', (history: PollHistory[]) => {
      console.log('Received poll history:', history);
      setPollHistory(history || []);
      setIsLoadingHistory(false);
    });

    socket.on('chat-history', (messages: ChatMessage[]) => {
      setChatMessages(messages);
    });

    socket.on('new-message', (message: ChatMessage) => {
      setChatMessages(prev => [...prev, message]);
      if (!showChat && message.senderType === 'student') {
        setUnreadMessages(prev => prev + 1);
      }
    });

    return () => {
      console.log('Cleaning up socket listeners');
      socket.off('current-poll');
      socket.off('students-list');
      socket.off('poll-created');
      socket.off('poll-results');
      socket.off('poll-ended');
      socket.off('poll-history');
      socket.off('chat-history');
      socket.off('new-message');
    };
  }, [socket, showChat]);

  const handleCreatePoll = (pollData: { question: string; options: string[]; timeLimit: number }) => {
    console.log('Creating poll with data:', pollData);
    
    if (!socket) {
      console.error('Socket not connected - cannot create poll');
      alert('Connection error. Please refresh the page and try again.');
      return;
    }

    if (!pollData.question.trim()) {
      console.error('Question is empty');
      alert('Please enter a question for the poll.');
      return;
    }

    if (pollData.options.length < 2) {
      console.error('Not enough options');
      alert('Please provide at least 2 answer options.');
      return;
    }

    try {
      socket.emit('create-poll', pollData);
      console.log('Poll creation request sent to server');
      setShowCreatePoll(false);
    } catch (error) {
      console.error('Error creating poll:', error);
      alert('Failed to create poll. Please try again.');
    }
  };

  const handleEndPoll = () => {
    if (socket) {
      console.log('Ending current poll');
      socket.emit('end-poll');
    }
  };

  const handleKickStudent = (studentId: string) => {
    if (socket) {
      console.log('Kicking student:', studentId);
      socket.emit('kick-student', studentId);
    }
  };

  const handleSendMessage = (text: string) => {
    if (socket) {
      socket.emit('send-message', {
        text,
        sender: 'Teacher',
        senderType: 'teacher'
      });
    }
  };

  const handleShowHistory = () => {
    if (socket) {
      console.log('Requesting poll history');
      setIsLoadingHistory(true);
      setActiveTab('history');
      socket.emit('get-poll-history');
    }
  };

  const handleChatToggle = () => {
    setShowChat(!showChat);
    if (!showChat) {
      setUnreadMessages(0);
    }
  };

  const canCreateNewPoll = !currentPoll || students.every(student => student.hasAnswered);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-40 right-32 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rotate-45 opacity-70 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-40 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
        <div className="absolute top-60 left-1/3 w-8 h-8 bg-gradient-to-r from-red-400 to-yellow-500 rotate-12 opacity-60 animate-spin" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-40 right-20 w-14 h-14 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-300/30 to-indigo-300/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
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
                <h1 className="text-5xl font-black bg-gradient-to-r from-purple-500 via-pink-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-3">
                  <Brain className="w-12 h-12 text-purple-500 animate-pulse" />
                  Teacher Command Center
                  <Trophy className="w-10 h-10 text-yellow-500 animate-bounce" />
                </h1>
                <p className="text-gray-700 text-xl font-bold">🎯 Create amazing quizzes and watch your students shine! ✨</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
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
              
              <div className="flex bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-xl border-4 border-white/40">
                <Button
                  variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('dashboard')}
                  className={`flex items-center gap-2 transition-all duration-300 rounded-xl px-4 py-2 font-bold ${
                    activeTab === 'dashboard' 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg border-2 border-white/50' 
                      : 'hover:bg-white/70'
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  Dashboard 📊
                </Button>
                <Button
                  variant={activeTab === 'history' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={handleShowHistory}
                  className={`flex items-center gap-2 transition-all duration-300 rounded-xl px-4 py-2 font-bold ${
                    activeTab === 'history' 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg border-2 border-white/50' 
                      : 'hover:bg-white/70'
                  }`}
                >
                  <History className="w-5 h-5" />
                  History ({pollHistory.length}) 📚
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          {activeTab === 'dashboard' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Current Poll Status */}
                <Card className="bg-white/90 backdrop-blur-sm border-4 border-white/40 shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-3xl">
                  <CardHeader className="bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-t-3xl border-b-4 border-purple-200">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3 text-2xl font-black">
                        <BookOpen className="w-8 h-8 text-purple-600 animate-pulse" />
                        Current Quiz Challenge
                        <Star className="w-6 h-6 text-yellow-500 animate-spin" />
                      </CardTitle>
                      <Button
                        onClick={() => {
                          console.log('Create poll button clicked, canCreateNewPoll:', canCreateNewPoll);
                          setShowCreatePoll(true);
                        }}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-2xl px-6 py-3 font-black text-lg border-4 border-white/50"
                        disabled={!canCreateNewPoll}
                      >
                        <Plus className="w-5 h-5" />
                        Create Quiz 🚀
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    {currentPoll ? (
                      <div className="space-y-6">
                        <div className="p-8 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl border-4 border-blue-200 shadow-lg">
                          <h3 className="font-black text-2xl mb-4 text-gray-800 flex items-center gap-2">
                            <Zap className="w-6 h-6 text-yellow-500" />
                            {currentPoll.question}
                          </h3>
                          <div className="flex flex-wrap gap-3 mb-6">
                            {currentPoll.options.map((option, index) => (
                              <Badge key={index} variant="outline" className="bg-white/90 border-4 border-purple-200 text-purple-700 px-4 py-2 text-lg font-bold rounded-xl">
                                {String.fromCharCode(65 + index)}) {option}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-lg text-gray-700 font-bold">
                            <span className="flex items-center gap-2 bg-yellow-200 px-4 py-2 rounded-xl">
                              ⏱️ Time limit: <strong className="text-orange-600">{currentPoll.timeLimit}s</strong>
                            </span>
                            <span className="flex items-center gap-2 bg-green-200 px-4 py-2 rounded-xl">
                              📊 Responses: <strong className="text-green-600">{students.filter(s => s.hasAnswered).length}/{students.length}</strong>
                            </span>
                          </div>
                        </div>
                        
                        {!canCreateNewPoll && (
                          <div className="text-center text-amber-800 bg-gradient-to-r from-amber-200 to-yellow-200 p-6 rounded-2xl border-4 border-amber-300 animate-pulse font-bold text-lg">
                            ⏳ Waiting for all students to answer before you can create a new quiz! 🎯
                          </div>
                        )}
                        
                        <Button
                          onClick={handleEndPoll}
                          variant="destructive"
                          className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-2xl py-4 font-black text-xl border-4 border-white/50"
                        >
                          🏁 End Quiz Now
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full flex items-center justify-center shadow-xl">
                          <BarChart3 className="w-16 h-16 text-purple-500 animate-pulse" />
                        </div>
                        <p className="text-gray-600 mb-8 text-2xl font-bold">No active quiz yet! 🤔</p>
                        <Button
                          onClick={() => {
                            console.log('Create first poll button clicked');
                            setShowCreatePoll(true);
                          }}
                          className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 px-10 py-6 text-2xl font-black rounded-2xl border-4 border-white/50"
                        >
                          <Plus className="w-8 h-8" />
                          Create Your First Amazing Quiz! 🌟
                          <Zap className="w-8 h-8 animate-pulse" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Poll Results */}
                {pollResults && (
                  <div className="animate-fadeIn">
                    <PollResultsView results={pollResults} />
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="animate-slideInRight">
                  <StudentsList
                    students={students}
                    onKickStudent={handleKickStudent}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-fadeIn">
              {isLoadingHistory ? (
                <Card className="bg-white/90 backdrop-blur-sm border-4 border-white/40 shadow-2xl rounded-3xl">
                  <CardContent className="text-center py-20">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full flex items-center justify-center animate-spin shadow-xl">
                      <History className="w-10 h-10 text-purple-500" />
                    </div>
                    <p className="text-gray-600 text-2xl font-bold">Loading quiz history... 📚</p>
                  </CardContent>
                </Card>
              ) : (
                <PollHistoryView history={pollHistory} />
              )}
            </div>
          )}

          {/* Create Poll Modal */}
          {showCreatePoll && (
            <CreatePollModal
              onClose={() => {
                console.log('Closing create poll modal');
                setShowCreatePoll(false);
              }}
              onSubmit={handleCreatePoll}
            />
          )}

          {/* Chat Widget */}
          {showChat && (
            <ChatWidget
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              onClose={handleChatToggle}
              userType="teacher"
              userName="Teacher"
            />
          )}
        </div>
      </div>
    </div>
  );
};