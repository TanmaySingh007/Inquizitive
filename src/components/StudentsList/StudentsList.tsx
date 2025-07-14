import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Student } from '../../types';
import { Users, UserX, CheckCircle, Clock, Crown } from 'lucide-react';

interface StudentsListProps {
  students: Student[];
  onKickStudent: (studentId: string) => void;
}

export const StudentsList: React.FC<StudentsListProps> = ({ students, onKickStudent }) => {
  const answeredCount = students.filter(student => student.hasAnswered).length;
  const completionRate = students.length > 0 ? Math.round((answeredCount / students.length) * 100) : 0;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-t-lg">
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              Students
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {students.length}
              </Badge>
            </div>
            {students.length > 0 && (
              <div className="text-sm text-gray-600 font-normal">
                {answeredCount}/{students.length} answered ({completionRate}%)
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {students.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-gray-100 to-blue-100 rounded-full flex items-center justify-center animate-pulse">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No students connected</p>
            <p className="text-gray-400 text-sm">Students will appear here when they join</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Response Progress</span>
                <span className="text-sm text-gray-600">{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            {students.map((student, index) => (
              <div
                key={student.id}
                className={`flex items-center justify-between p-4 border-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  student.hasAnswered
                    ? 'border-green-200 bg-gradient-to-r from-green-50 to-blue-50 shadow-md'
                    : 'border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {student.hasAnswered ? (
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                    )}
                    {index === 0 && (
                      <Crown className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800">{student.name}</span>
                      {index === 0 && (
                        <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700 text-xs">
                          First to join
                        </Badge>
                      )}
                    </div>
                    <Badge 
                      variant={student.hasAnswered ? "default" : "secondary"}
                      className={`text-xs ${
                        student.hasAnswered 
                          ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white' 
                          : 'bg-amber-100 text-amber-700 border-amber-200'
                      }`}
                    >
                      {student.hasAnswered ? "✅ Answered" : "⏳ Pending"}
                    </Badge>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onKickStudent(student.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 transition-all duration-200"
                >
                  <UserX className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};