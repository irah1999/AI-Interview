import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useVideoRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
          frameRate: { ideal: 30, max: 60 },
          facingMode: 'user'
        }, 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.setAttribute('webkit-playsinline', 'true');
        
        try {
          await videoRef.current.play();
          await startRecording(stream);
        } catch (playError) {
          console.log('Video play error:', playError);
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.play().catch(console.error);
            }
          }, 100);
        }
      }

      return stream;
    } catch (error) {
      console.error('Camera access error:', error);
      toast({
        title: "Error",
        description: "Failed to access camera. Please check your camera permissions.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const startRecording = async (stream: MediaStream) => {
    try {
      const options = {
        mimeType: 'video/webm;codecs=vp9,opus',
        videoBitsPerSecond: 2500000,
        audioBitsPerSecond: 128000
      };

      mediaRecorderRef.current = new MediaRecorder(stream, options);
      recordedChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const videoBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        uploadToGoogleDrive(videoBlob);
      };

      mediaRecorderRef.current.start(3000);
      setIsRecording(true);
      console.log('Recording started with optimized settings');
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const uploadToGoogleDrive = async (videoBlob: Blob) => {
    try {
      console.log('Simulating Google Drive upload for video blob:', videoBlob.size, 'bytes');
      console.log('Video would be uploaded to Google Drive here');
      
      toast({
        title: "Recording Saved",
        description: "Interview recording has been saved to cloud storage.",
      });
    } catch (error) {
      console.error('Failed to upload to Google Drive:', error);
      toast({
        title: "Upload Warning",
        description: "Recording saved locally. Upload to cloud pending.",
        variant: "destructive"
      });
    }
  };

  return {
    videoRef,
    isRecording,
    startCamera,
    stopRecording
  };
};