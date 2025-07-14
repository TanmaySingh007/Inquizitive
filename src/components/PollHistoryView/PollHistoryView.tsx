import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { PollHistory } from '../../types';
import { History, Calendar, Users, BarChart3, Trophy, Clock, ChevronDown, ChevronUp, User } from 'lucide-react';

interface PollHistoryViewProps {
  history: PollHistory[];
}

export const PollHistoryView: React.FC<PollHistoryViewProps> = ({ history }) => {
  console.log('PollHistoryView rendering with history:', history);
  const [expandedPolls, setExpandedPolls] = useState<Set<string>>(new Set());

  const togglePollExpansion = (pollId: string) => {
    const newExpanded = new Set(expandedPolls);
    if (newExpanded.has(pollId)) {
      newExpanded.delete(pollId);
    } else {
      newExpanded.add(pollId);
    }
    setExpandedPolls(newExpanded);
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const formatTime = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'Invalid Time';
    }
  };

  const getTotalVotes = (results: Record<string, number>) => {
    if (!results || typeof results !== 'object') return 0;
    return Object.values(results).reduce((sum, votes) => sum + (votes || 0), 0);
  };

  const getMostPopularAnswer = (results: Record<string, number>) => {
    if (!results || typeof results !== 'object') return null;
    const entries = Object.entries(results);
    if (entries.length === 0) return null;
    return entries.reduce((max, current) => (current[1] || 0) > (max[1] || 0) ? current : max);
  };

  // Ensure history is an array
  const safeHistory = Array.isArray(history) ? history : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
          <History className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Poll History
          </h2>
          <p className="text-gray-600">Review all completed polls and their results</p>
        </div>
        <Badge variant="outline" className="ml-auto bg-white/80 border-purple-200 text-purple-700 px-4 py-2 text-lg">
          {safeHistory.length} polls completed
        </Badge>
      </div>

      {safeHistory.length === 0 ? (
        <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
          <CardContent className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-purple-100 rounded-full flex items-center justify-center animate-pulse">
              <History className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Poll History</h3>
            <p className="text-gray-600 text-lg">Create and complete polls to see them here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8">
          {safeHistory.map((poll, index) => {
            const totalVotes = getTotalVotes(poll.results || {});
            const mostPopular = getMostPopularAnswer(poll.results || {});
            const maxVotes = Math.max(...Object.values(poll.results || {}));
            const isExpanded = expandedPolls.has(poll.id);

            return (
              <Card key={poll.id || index} className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                <CardHeader className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-t-lg">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1">
                          Poll #{safeHistory.length - index}
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                          ✅ Completed
                        </Badge>
                      </div>
                      <CardTitle className="text-xl text-gray-800 leading-relaxed">
                        {poll.question || 'Untitled Poll'}
                      </CardTitle>
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-500" />
                          <span className="font-medium">{formatDate(poll.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">{totalVotes} responses</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-500" />
                          <span className="font-medium">{poll.timeLimit || 60}s limit</span>
                        </div>
                      </div>
                    </div>
                    
                    {mostPopular && mostPopular[1] > 0 && (
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span>Most Popular</span>
                        </div>
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1">
                          {mostPopular[0]}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          {mostPopular[1]} votes ({totalVotes > 0 ? Math.round((mostPopular[1] / totalVotes) * 100) : 0}%)
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-purple-500" />
                        <h4 className="font-semibold text-gray-800">Results Breakdown</h4>
                      </div>
                      
                      {poll.studentResponses && poll.studentResponses.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePollExpansion(poll.id)}
                          className="flex items-center gap-2 bg-white/80 border-purple-200 text-purple-700 hover:bg-purple-50"
                        >
                          <User className="w-4 h-4" />
                          View Student Responses
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                      )}
                    </div>
                    
                    {poll.results && Object.keys(poll.results).length > 0 ? (
                      Object.entries(poll.results).map(([option, votes]) => {
                        const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
                        const barWidth = maxVotes > 0 ? (votes / maxVotes) * 100 : 0;
                        const isWinner = votes === maxVotes && votes > 0;

                        return (
                          <div key={option} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {isWinner && <Trophy className="w-4 h-4 text-yellow-500" />}
                                <span className={`font-medium ${isWinner ? 'text-yellow-700' : 'text-gray-700'}`}>
                                  {option}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600 font-medium">
                                  {votes} vote{votes !== 1 ? 's' : ''}
                                </span>
                                <Badge 
                                  variant="secondary" 
                                  className={`px-3 py-1 ${
                                    isWinner 
                                      ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200' 
                                      : 'bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {percentage.toFixed(1)}%
                                </Badge>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                              <div
                                className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                                  isWinner 
                                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                                    : 'bg-gradient-to-r from-blue-400 to-purple-500'
                                }`}
                                style={{ width: `${barWidth}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No responses received</p>
                      </div>
                    )}

                    {/* Student Responses Details */}
                    {isExpanded && poll.studentResponses && poll.studentResponses.length > 0 && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 animate-fadeIn">
                        <h5 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-500" />
                          Individual Student Responses ({poll.studentResponses.length})
                        </h5>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {poll.studentResponses
                            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                            .map((response, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white/80 rounded-lg border border-white/50 hover:bg-white/90 transition-all duration-200">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                  {response.studentName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-800">{response.studentName}</div>
                                  <div className="text-sm text-gray-600">answered: <span className="font-semibold text-blue-600">{response.answer}</span></div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-gray-500">{formatTime(response.timestamp)}</div>
                                <Badge variant="outline" className="text-xs bg-green-50 border-green-200 text-green-700 mt-1">
                                  #{idx + 1}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Summary Stats */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-blue-600">{totalVotes}</div>
                        <div className="text-xs text-blue-600 font-medium">Total Votes</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-purple-600">{Object.keys(poll.results || {}).length}</div>
                        <div className="text-xs text-purple-600 font-medium">Options</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-green-600">
                          {poll.totalResponses && totalVotes > 0 ? Math.round((totalVotes / poll.totalResponses) * 100) : 0}%
                        </div>
                        <div className="text-xs text-green-600 font-medium">Participation</div>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-orange-600">
                          {poll.studentResponses ? poll.studentResponses.length : 0}
                        </div>
                        <div className="text-xs text-orange-600 font-medium">Students</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};