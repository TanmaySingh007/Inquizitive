import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { X, Plus, Trash2, Sparkles, Clock, HelpCircle } from 'lucide-react';

interface CreatePollModalProps {
  onClose: () => void;
  onSubmit: (pollData: { question: string; options: string[]; timeLimit: number }) => void;
}

export const CreatePollModal: React.FC<CreatePollModalProps> = ({ onClose, onSubmit }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [timeLimit, setTimeLimit] = useState(60);

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with:', { question, options, timeLimit });
    
    const validOptions = options.filter(option => option.trim() !== '');
    console.log('Valid options:', validOptions);
    
    if (question.trim() && validOptions.length >= 2) {
      const pollData = {
        question: question.trim(),
        options: validOptions,
        timeLimit
      };
      console.log('Calling onSubmit with:', pollData);
      onSubmit(pollData);
    } else {
      console.log('Form validation failed:', {
        hasQuestion: !!question.trim(),
        validOptionsCount: validOptions.length
      });
    }
  };

  const isValid = question.trim() && options.filter(option => option.trim()).length >= 2;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm shadow-2xl border-white/20 animate-slideInUp">
        <CardHeader className="border-b bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              Create New Poll
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-red-50 hover:text-red-600">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Question */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-500" />
                Poll Question *
              </label>
              <Input
                type="text"
                placeholder="What would you like to ask your students?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full text-lg p-4 bg-white/80 border-gray-200 focus:border-purple-300 focus:ring-purple-200 rounded-xl"
                required
              />
            </div>

            {/* Options */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-500" />
                Answer Options * (minimum 2, maximum 6)
              </label>
              <div className="space-y-3">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-purple-700">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <Input
                      type="text"
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="flex-1 bg-white/80 border-gray-200 focus:border-blue-300 focus:ring-blue-200 rounded-lg"
                    />
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveOption(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              {options.length < 6 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddOption}
                  className="flex items-center gap-2 bg-white/80 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Option
                </Button>
              )}
            </div>

            {/* Time Limit */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-500" />
                Time Limit (seconds)
              </label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min="10"
                  max="300"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value) || 60)}
                  className="w-32 bg-white/80 border-gray-200 focus:border-green-300 focus:ring-green-200 rounded-lg"
                />
                <div className="flex gap-2">
                  {[30, 60, 120, 180].map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setTimeLimit(time)}
                      className={`${
                        timeLimit === time 
                          ? 'bg-green-100 border-green-300 text-green-700' 
                          : 'bg-white/80 border-gray-200 hover:bg-green-50'
                      }`}
                    >
                      {time}s
                    </Button>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Students will have this much time to submit their answers
              </p>
            </div>

            {/* Validation Message */}
            {!isValid && (
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl animate-pulse">
                <p className="text-sm text-amber-700 font-medium">
                  ⚠️ Please fill in the question and at least 2 answer options to create the poll.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                className="flex-1 bg-white/80 border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!isValid} 
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create Poll
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};