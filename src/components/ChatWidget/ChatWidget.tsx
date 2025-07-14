import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ChatMessage } from '../../types';
import { X, Send, MessageCircle, Sparkles } from 'lucide-react';

interface ChatWidgetProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onClose: () => void;
  userType: 'teacher' | 'student';
  userName: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  messages,
  onSendMessage,
  onClose,
  userType,
  userName
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] z-50 animate-slideInUp">
      <Card className="h-full flex flex-col shadow-2xl bg-white/95 backdrop-blur-sm border-white/20">
        <CardHeader className="pb-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              Chat
              <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white animate-pulse">
                LIVE
              </Badge>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-red-50 hover:text-red-600">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white/50">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-purple-500" />
                </div>
                <p className="text-gray-500 text-sm font-medium">No messages yet</p>
                <p className="text-gray-400 text-xs">Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex flex-col animate-fadeIn ${
                    message.sender === userName ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                      message.sender === userName
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    <div className="text-sm leading-relaxed">{message.text}</div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 px-1">
                    <Badge
                      variant="outline"
                      className={`text-xs px-2 py-1 ${
                        message.senderType === 'teacher'
                          ? 'border-purple-200 text-purple-700 bg-purple-50'
                          : 'border-blue-200 text-blue-700 bg-blue-50'
                      }`}
                    >
                      {message.senderType === 'teacher' ? '👨‍🏫' : '👨‍🎓'} {message.sender}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t bg-white/80 backdrop-blur-sm p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-white/80 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
              />
              <Button 
                type="submit" 
                size="sm" 
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};