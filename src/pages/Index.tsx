
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeviceCheck from "@/components/DeviceCheck";
import InterviewInterface from "@/components/InterviewInterface";
import CandidateInfoForm from "@/components/CandidateInfoForm";
import FeedbackForm from "@/components/FeedbackForm";
import ThankYouPage from "@/components/ThankYouPage";
import InterviewCompletedMessage from "@/components/InterviewCompletedMessage";
import AIMonitoringAgreement from "@/components/AIMonitoringAgreement";
import { Camera, Mic, Monitor, Shield } from "lucide-react";
import { useParams } from 'react-router-dom';
import { InterviewService } from "@/service/interviews.service";
import { Interview } from "@/types/interview";

const Index = () => {
  const [currentView, setCurrentView] = useState<"home" | "candidate-info" | "ai-agreement" | "device-check" | "interview" | "feedback" | "thank-you" | "completed">("home");
  const [deviceStatus, setDeviceStatus] = useState({
    camera: false,
    microphone: false,
    singleMonitor: false
  });
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });

  
  // Check if interview is already completed
  useEffect(() => {
    const completed = localStorage.getItem('interviewCompleted');
    if (completed && currentView === "home") {
      setCurrentView("completed");
    }
  }, [currentView, []]);

  const handleDeviceCheckComplete = (status: typeof deviceStatus) => {
    setDeviceStatus(status);
    if (status.camera && status.microphone && status.singleMonitor) {
      setCurrentView("interview");
    }
  };

  const handleCandidateInfoComplete = () => {
    setCurrentView("ai-agreement");
  };

  const handleAIAgreementAccept = () => {
    setCurrentView("device-check");
  };

  const handleAIAgreementCancel = () => {
    setCurrentView("home");
  };

  const handleInterviewComplete = () => {
    // Mark interview as completed
    // const completionData = {
    //   completedAt: new Date().toISOString(),
    //   candidateInfo: localStorage.getItem('candidateInfo')
    // };
    // localStorage.setItem('interviewCompleted', JSON.stringify(completionData));
    setCurrentView("feedback");
  };

  const handleFeedbackComplete = () => {
    setCurrentView("thank-you");
  };

  const handleBackToHome = () => {
    setCurrentView("home");
  };

  if (currentView === "completed") {
    return <InterviewCompletedMessage onBackToHome={handleBackToHome} />;
  }

  if (currentView === "candidate-info") {
    return <CandidateInfoForm onComplete={handleCandidateInfoComplete} formData={formData} setFormData={setFormData} />;
  }

  if (currentView === "ai-agreement") {
    return <AIMonitoringAgreement onAgree={handleAIAgreementAccept} onCancel={handleAIAgreementCancel} />;
  }

  if (currentView === "device-check") {
    return <DeviceCheck onComplete={handleDeviceCheckComplete} />;
  }

  if (currentView === "interview" && formData) {
    return <InterviewInterface onExit={handleInterviewComplete} formData={formData}/>;
  }

  if (currentView === "feedback") {
    return <FeedbackForm onComplete={handleFeedbackComplete} />;
  }

  if (currentView === "thank-you") {
    return <ThankYouPage onBackToHome={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-orange-400 mr-4" />
            <h1 className="text-4xl font-bold text-white">SecureInterview</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            AI-Powered Interview Monitoring Platform with Advanced Proctoring Capabilities
          </p>
        </div>

        {/* Main Portal */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white/95 border-orange-200 hover:bg-white transition-all duration-300 shadow-2xl">
            <CardHeader className="bg-orange-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center justify-center">
                <Camera className="h-6 w-6 mr-2" />
                Start Interview Process
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <p className="text-gray-700 text-center">
                Begin your secure interview session with comprehensive device checks and real-time monitoring.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-4 w-4 mr-2 text-orange-500" />
                  Candidate Information Collection
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Camera className="h-4 w-4 mr-2 text-orange-500" />
                  Camera & Microphone Check
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Monitor className="h-4 w-4 mr-2 text-orange-500" />
                  Single Monitor Verification
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mic className="h-4 w-4 mr-2 text-orange-500" />
                  AI-Powered Behavior Monitoring
                </div>
              </div>

              <Button 
                onClick={() => setCurrentView("candidate-info")}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                Begin Interview Setup
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-8">Advanced Monitoring Features</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-orange-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Camera className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Video Recording</h3>
              <p className="text-gray-400 text-sm">Continuous recording with Google Drive integration</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">AI Monitoring</h3>
              <p className="text-gray-400 text-sm">Real-time behavior detection and alerts</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Monitor className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Screen Control</h3>
              <p className="text-gray-400 text-sm">Full-screen enforcement and exit prevention</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-500/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Mic className="h-8 w-8 text-orange-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">Device Verification</h3>
              <p className="text-gray-400 text-sm">Comprehensive pre-interview system checks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
