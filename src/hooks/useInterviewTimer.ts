import { useState, useEffect } from 'react';

export const useInterviewTimer = (isRecording: boolean, onTimeEnd: () => void) => {
  const [timeRemaining, setTimeRemaining] = useState(30 * 60); // 30 minutes

  useEffect(() => {
    if (isRecording && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0) {
      onTimeEnd();
    }
  }, [isRecording, timeRemaining, onTimeEnd]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timeRemaining,
    formatTime
  };
};