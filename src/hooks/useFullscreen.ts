import { useState, useEffect } from 'react';

export const useFullscreen = (isRecording: boolean, onExitAttempt: () => void) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      
      if (!isCurrentlyFullscreen && isRecording) {
        onExitAttempt();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const forbiddenKeys = ['Escape', 'Alt', 'Meta', 'F11'];
      if (forbiddenKeys.includes(e.key) && isRecording) {
        e.preventDefault();
        onExitAttempt();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRecording, onExitAttempt]);

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      setIsFullscreen(false);
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  };

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen
  };
};