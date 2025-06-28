import React, { useState } from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { TeacherDashboard } from "../TeacherDashboard";
import { StudentDashboard } from "../StudentDashboard";
import { Brain, Users, GraduationCap, Star, Zap, BookOpen } from "lucide-react";

export const Desktop = (): JSX.Element => {
  const [selectedRole, setSelectedRole] = useState<
    "student" | "teacher" | null
  >(null);
  const [currentView, setCurrentView] = useState<"selection" | "dashboard">("selection");

  const roleOptions = [
    {
      id: "student",
      title: "I'm a Student 🎓",
      description:
        "Join exciting live quizzes, submit your answers, and see how you stack up against classmates!",
      icon: GraduationCap,
      gradient: "from-emerald-400 via-cyan-500 to-blue-600",
      bgGradient: "from-emerald-50 via-cyan-50 to-blue-50",
      borderGradient: "from-emerald-300 to-blue-400",
      emoji: "🎓"
    },
    {
      id: "teacher",
      title: "I'm a Teacher 👨‍🏫",
      description: "Create engaging quizzes, manage your classroom, and watch students learn in real-time!",
      icon: Users,
      gradient: "from-purple-400 via-pink-500 to-red-500",
      bgGradient: "from-purple-50 via-pink-50 to-red-50",
      borderGradient: "from-purple-300 to-red-400",
      emoji: "👨‍🏫"
    },
  ];

  const handleContinue = () => {
    if (selectedRole) {
      setCurrentView("dashboard");
    }
  };

  const handleBack = () => {
    setCurrentView("selection");
    setSelectedRole(null);
  };

  if (currentView === "dashboard") {
    return selectedRole === "teacher" ? (
      <TeacherDashboard onBack={handleBack} />
    ) : (
      <StudentDashboard onBack={handleBack} />
    );
  }

  return (
    <div className="bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-200 flex flex-row justify-center w-full min-h-screen relative overflow-hidden">
      {/* Animated Background Elements - More Colorful */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-20 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-40 right-32 w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rotate-45 opacity-70 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-40 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
        <div className="absolute top-60 left-1/3 w-8 h-8 bg-gradient-to-r from-red-400 to-yellow-500 rotate-12 opacity-60 animate-spin" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-40 right-20 w-14 h-14 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        
        {/* Large background blurs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-300/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-300/30 to-blue-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-yellow-200/20 to-orange-300/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="w-full max-w-[1440px] h-screen relative z-10 flex flex-col items-center justify-center">
        {/* Large Inquizitive Badge at Top with Brain Icon */}
        <div className="mb-8 animate-fadeInUp">
          <Badge className="flex w-[400px] h-[80px] items-center justify-center gap-[12px] px-[24px] py-0 rounded-[40px] bg-gradient-to-r from-orange-400 via-red-500 to-pink-600 font-['Sora',Helvetica] font-black text-white text-4xl shadow-2xl transform hover:scale-110 transition-all duration-500 hover:shadow-3xl border-4 border-white/30">
            <Brain className="w-12 h-12 animate-pulse" />
            <span className="bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
              Inquizitive
            </span>
            <Star className="w-8 h-8 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} />
          </Badge>
          
          {/* Fun subtitle */}
          <div className="text-center mt-4">
            <div className="flex items-center justify-center gap-2 text-2xl animate-bounce">
              <Zap className="w-6 h-6 text-yellow-500" />
              <span className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Where Learning Meets Fun!
              </span>
              <BookOpen className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>

        <div className="flex flex-col w-[981px] items-center gap-[35px]">
          <div className="inline-flex flex-col items-center gap-[15px] relative flex-[0_0_auto]">
            <div className="flex flex-col w-[737px] items-center gap-[8px] relative flex-[0_0_auto]">
              <h1 className="relative self-stretch mt-[-1.00px] font-['Sora',Helvetica] text-[28px] text-center tracking-[0] leading-normal animate-fadeInUp delay-200">
                <span className="font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">Welcome to the </span>
                <span className="font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent">
                  Interactive Learning Experience
                </span>
              </h1>

              <p className="relative self-stretch font-['Sora',Helvetica] font-medium text-[#444444] text-[16px] text-center tracking-[0] leading-relaxed animate-fadeInUp delay-300">
                🚀 Choose your role and dive into an amazing world of interactive quizzes and real-time learning! 
                <br />
                <span className="text-purple-600 font-semibold">Let's make education exciting together! ✨</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-10 mb-10 animate-fadeInUp delay-400">
          {roleOptions.map((role) => (
            <Card
              key={role.id}
              className={`w-[450px] h-[220px] rounded-3xl cursor-pointer transition-all duration-500 hover:shadow-2xl transform hover:scale-110 hover:rotate-1 ${
                selectedRole === role.id
                  ? `border-4 shadow-2xl bg-gradient-to-br ${role.bgGradient} backdrop-blur-sm border-gradient-to-r ${role.borderGradient} animate-pulse`
                  : "border-3 border-solid border-white/40 hover:border-purple-400 bg-white/90 backdrop-blur-sm shadow-xl hover:bg-white/95"
              }`}
              onClick={() => setSelectedRole(role.id as "student" | "teacher")}
              style={{
                background: selectedRole === role.id 
                  ? `linear-gradient(135deg, ${role.bgGradient.replace('from-', '').replace(' via-', ', ').replace(' to-', ', ')})` 
                  : undefined
              }}
            >
              <CardContent className="flex flex-col items-center justify-center gap-[25px] p-[25px] h-full text-center">
                <div className="inline-flex flex-col items-center justify-center gap-[15px]">
                  <div className="inline-flex items-center justify-center gap-[20px]">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-r ${role.gradient} flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-white/50`}>
                      <role.icon className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h2 className="font-['Sora',Helvetica] font-black text-gray-800 text-[28px] tracking-[0] leading-normal">
                    {role.title}
                  </h2>
                </div>
                <p className={`font-['Sora',Helvetica] font-medium text-[#666666] text-[16px] tracking-[0] leading-relaxed w-full ${
                  selectedRole === role.id ? 'text-gray-700 font-semibold' : ''
                }`}>
                  {role.description}
                </p>
                
                {/* Fun decorative elements */}
                <div className="flex gap-2 opacity-60">
                  <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button 
          className="w-[320px] h-[80px] rounded-[40px] bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 hover:from-green-500 hover:via-blue-600 hover:to-purple-700 font-['Sora',Helvetica] font-black text-white text-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none animate-fadeInUp delay-600 border-4 border-white/30"
          onClick={handleContinue}
          disabled={!selectedRole}
        >
          <Zap className="w-8 h-8 mr-3 animate-pulse" />
          Let's Go! 🚀
          <Star className="w-8 h-8 ml-3 animate-spin" style={{ animationDuration: '3s' }} />
        </Button>

        {/* Fun footer message */}
        <div className="mt-8 text-center animate-fadeInUp delay-800">
          <p className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🎉 Ready to make learning awesome? Choose your adventure above! 🎉
          </p>
        </div>
      </div>
    </div>
  );
};