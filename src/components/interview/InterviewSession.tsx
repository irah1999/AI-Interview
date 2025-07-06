import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useVideoRecorder } from "@/hooks/useVideoRecorder";
import { useInterviewTimer } from "@/hooks/useInterviewTimer";
import { useScreenshotCapture } from "@/hooks/useScreenshotCapture";
import InterviewHeader from "./InterviewHeader";
import VideoMonitor from "./VideoMonitor";
import InterviewContent from "./InterviewContent";
import WarningDialog from "../WarningDialog";
import ExitConfirmDialog from "../ExitConfirmDialog";
import FaceDetectionMonitor from "../FaceDetectionMonitor";
import { Interview } from "@/types/interview";
import { InterviewService } from "@/service/interviews.service";
import { useParams } from 'react-router-dom';

interface InterviewSessionProps {
  onExit: () => void;
  formData: {
    name: string;
    email: string;
  };
}

const InterviewSession = ({ onExit, formData }: InterviewSessionProps) => {
  const { interviewType } = useParams();
  const [warningCount, setWarningCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [lastWarningType, setLastWarningType] = useState("");
  const [confirmEndInterview, setConfirmEndInterview] = useState(false);
  const [warnings, setWarnings] = useState<Array<{
    id: string;
    type: string;
    timestamp: string;
    description: string;
  }>>([]);
  const { toast } = useToast();

  // Get candidate details from localStorage
  const getCandidateDetails = () => {
    const stored = localStorage.getItem('candidateInfo');
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      name: "Candidate",
      email: "candidate@example.com"
    };
  };
  const [interview, setInterview] = useState<Interview>();

  const fetchInterviewById = async (interviewid: any) => {
    return await InterviewService.getInterviewById(interviewid);
  };
  
  // Check if interview is already completed
  useEffect(() => {
    if (interviewType) {
      const fetchData = async () => {
        try {
          const result = await fetchInterviewById(interviewType);
          if (result?.success) {
            let updatedResult = result?.data || {};
            updatedResult.questions = JSON.parse(updatedResult.questions);
            setInterview(result?.data);
          }
          // Do something with result if needed
        } catch (error) {
          console.error('Failed to fetch interview:', error);
        }
      };
      if (!interview) {
        fetchData();
      }
    }
  }, []);
  
  useEffect(() => {
    if (confirmEndInterview) {
      handleTimeEnd();
    }
   }, [confirmEndInterview]);

  const candidateDetails = getCandidateDetails();

  // Custom hooks
  const { videoRef, isRecording, startCamera, stopRecording } = useVideoRecorder();
  const { captureAndUploadScreenshot } = useScreenshotCapture();
  
  const handleTimeEnd = () => {
    endInterview();
  };
  
  const { timeRemaining, formatTime } = useInterviewTimer(isRecording, handleTimeEnd);
  
  const handleExitAttempt = () => {
    setShowExitConfirm(true);
  };
  
  const { enterFullscreen, exitFullscreen } = useFullscreen(isRecording, handleExitAttempt);

  // Initialize interview
  useEffect(() => {
    startInterview();
    return () => {
      exitFullscreen();
      stopRecording();
    };
  }, []);

  // Simulated AI monitoring
  useEffect(() => {
    if (isRecording) {
      const monitoringInterval = setInterval(() => {
        if (Math.random() < 0.1) {
          const behaviors = [
            "Excessive head movement detected",
            "Looking away from screen",
            "Face not clearly visible",
            "Multiple faces detected",
            "Unusual background activity"
          ];
          const randomBehavior = behaviors[Math.floor(Math.random() * behaviors.length)];
          triggerWarning(randomBehavior);
        }
      }, 5000);

      return () => clearInterval(monitoringInterval);
    }
  }, [isRecording]);

  const startInterview = async () => {
    try {
      await startCamera();
      await enterFullscreen();

      toast({
        title: "Interview Started",
        description: "Recording has begun. AI monitoring is active.",
      });
    } catch (error) {
      console.error('Failed to start interview:', error);
    }
  };

  const triggerWarning = async (type: string) => {
    const warningId = `warning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toLocaleTimeString();
    
    setWarningCount(prev => prev + 1);
    setLastWarningType(type);
    setShowWarning(true);

    // Add warning to the list
    const newWarning = {
      id: warningId,
      type: type,
      timestamp: timestamp,
      description: "Screenshot captured and saved to Google Drive for review."
    };
    
    setWarnings(prev => [...prev, newWarning]);

    // Capture and upload screenshot
    try {
      const result = await captureAndUploadScreenshot(videoRef.current, type);
      if (result) {
        console.log(`Warning triggered: ${type}. Screenshot captured and uploaded successfully.`);
      }
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
    }
    
    toast({
      title: "Behavior Warning",
      description: `${type} - Screenshot captured and saved to Google Drive`,
      variant: "destructive"
    });
  };

  const endInterview = async () => {
    stopRecording();
    await exitFullscreen();
    
    toast({
      title: "Interview Completed",
      description: "Your interview session has ended. Thank you for your time.",
    });
    
    console.log(`Interview ended. Total warnings: ${warningCount}`);
    onExit();
  };

  const handleConfirmExit = () => {
    setConfirmEndInterview(true);
    setShowExitConfirm(false);
    endInterview();
  };

  const handleEndInterview = () => {
    setShowExitConfirm(true);
  };

  const handleCancelConfirmExit = async () => {
    setShowExitConfirm(false);
    await enterFullscreen();
  }

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col">
      {/* Face Detection Monitor */}
      <FaceDetectionMonitor
        videoElement={videoRef.current}
        isActive={isRecording}
        onWarning={triggerWarning}
      />

      {/* Header */}
      <InterviewHeader
        candidateName={formData.name}
        candidateEmail={formData.email}
        isRecording={isRecording}
        formattedTime={formatTime(timeRemaining)}
        warningCount={warningCount}
      />

      {/* Main Content */}
      <div className="flex-1 flex bg-background">
        {
          interview ? (
            <InterviewContent onEndInterview={handleEndInterview} formData={formData} interview={interview} setConfirmEndInterview={setConfirmEndInterview} confirmEndInterview={confirmEndInterview}/>
          ) : null
        }
        <VideoMonitor videoRef={videoRef} warnings={warnings}/>
      </div>

      {/* Dialogs */}
      <WarningDialog
        open={showWarning}
        onClose={() => setShowWarning(false)}
        warningType={lastWarningType}
        warningCount={warningCount}
      />

      <ExitConfirmDialog
        open={showExitConfirm}
        onConfirm={handleConfirmExit}
        onCancel={handleCancelConfirmExit}
      />
    </div>
  );
};

export default InterviewSession;