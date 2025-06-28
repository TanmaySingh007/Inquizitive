import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { PollResults } from '../../types';
import { BarChart3, Trophy, Users, TrendingUp } from 'lucide-react';

interface PollResultsViewProps {
  results: PollResults;
}

export const PollResultsView: React.FC<PollResultsViewProps> = ({ results }) => {
  const maxVotes = Math.max(...Object.values(results.results));
  const totalVotes = results.totalResponses;
  const responseRate = Math.round((totalVotes / results.totalStudents) * 100);

  const sortedResults = Object.entries(results.results).sort(([,a], [,b]) => b - a);
  const winner = sortedResults[0];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          Live Poll Results
          <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white animate-pulse">
            LIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Question and Stats */}
          <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-blue-200/50">
            <h3 className="font-bold text-xl mb-4 text-gray-800">{results.question}</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center bg-white/80 rounded-lg p-3 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">{totalVotes}</div>
                <div className="text-sm text-blue-600 font-medium">Responses</div>
              </div>
              <div className="text-center bg-white/80 rounded-lg p-3 shadow-sm">
                <div className="text-2xl font-bold text-purple-600">{results.totalStudents}</div>
                <div className="text-sm text-purple-600 font-medium">Students</div>
              </div>
              <div className="text-center bg-white/80 rounded-lg p-3 shadow-sm">
                <div className="text-2xl font-bold text-green-600">{responseRate}%</div>
                <div className="text-sm text-green-600 font-medium">Response Rate</div>
              </div>
            </div>
          </div>

          {/* Winner Announcement */}
          {winner && winner[1] > 0 && (
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 animate-fadeIn">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <div>
                  <h4 className="font-bold text-yellow-800">Leading Answer</h4>
                  <p className="text-yellow-700">
                    <span className="font-semibold">"{winner[0]}"</span> with {winner[1]} votes 
                    ({Math.round((winner[1] / totalVotes) * 100)}%)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Results Chart */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <h4 className="font-semibold text-gray-800">Detailed Results</h4>
            </div>
            
            {sortedResults.map(([option, votes], index) => {
              const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
              const barWidth = maxVotes > 0 ? (votes / maxVotes) * 100 : 0;
              const isWinner = index === 0 && votes > 0;

              return (
                <div key={option} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isWinner && <Trophy className="w-4 h-4 text-yellow-500" />}
                      <span className={`font-medium text-lg ${isWinner ? 'text-yellow-700' : 'text-gray-700'}`}>
                        {option}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 font-medium">
                        {votes} vote{votes !== 1 ? 's' : ''}
                      </span>
                      <Badge 
                        variant="secondary" 
                        className={`px-3 py-1 text-sm ${
                          isWinner 
                            ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {percentage.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                    <div
                      className={`h-4 rounded-full transition-all duration-1000 ease-out ${
                        isWinner 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg' 
                          : 'bg-gradient-to-r from-blue-400 to-purple-500'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {totalVotes === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">No responses yet</p>
              <p className="text-gray-400">Results will appear as students submit their answers</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};