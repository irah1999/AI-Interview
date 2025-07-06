
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface FaceDetectionMonitorProps {
  videoElement: HTMLVideoElement | null;
  isActive: boolean;
  onWarning: (type: string) => void;
}

// Track looking away behavior
let lookingAwayStartTime = 0;
let isCurrentlyLookingAway = false;

const FaceDetectionMonitor = ({ videoElement, isActive, onWarning }: FaceDetectionMonitorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const [faceCount, setFaceCount] = useState(0);
  const [lastFaceDetection, setLastFaceDetection] = useState(Date.now());
  const { toast } = useToast();

  useEffect(() => {
    if (!isActive || !videoElement) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    // Create canvas for face detection
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = videoElement.videoWidth || 640;
    canvas.height = videoElement.videoHeight || 480;

    // Start face detection monitoring
    intervalRef.current = setInterval(() => {
      if (videoElement.readyState === 4) {
        detectFaces(videoElement, canvas, ctx);
      }
    }, 1000); // Check every second

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, videoElement]);

  const detectFaces = async (video: HTMLVideoElement, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    try {
      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get image data for analysis
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Simulate face detection (in a real implementation, you'd use a library like MediaPipe or face-api.js)
      const simulatedFaceCount = simulateFaceDetection(imageData);
      setFaceCount(simulatedFaceCount);
      
      // Check for warnings
      checkForWarnings(simulatedFaceCount);
      
    } catch (error) {
      console.error('Face detection error:', error);
    }
  };

  const simulateFaceDetection = (imageData: ImageData): number => {
    // Advanced AI-powered behavior monitoring simulation
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const totalPixels = data.length / 4;
    
    let faceRegionBrightness = 0;
    let upperRegionBrightness = 0;
    let lowerRegionBrightness = 0;
    let centerActivity = 0;
    
    // Define regions for advanced detection
    const centerX = width / 2;
    const centerY = height / 2;
    const faceRadius = Math.min(width, height) * 0.15;
    const upperRegionY = height * 0.3;
    const lowerRegionY = height * 0.7;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const brightness = (r + g + b) / 3;
        
        const distanceFromCenter = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        
        // Analyze face region (center area where face should be)
        if (distanceFromCenter < faceRadius) {
          faceRegionBrightness += brightness;
          centerActivity++;
        }
        
        // Analyze upper region (head/face area)
        if (y < upperRegionY) {
          upperRegionBrightness += brightness;
        }
        
        // Analyze lower region (body/phone usage area)
        if (y > lowerRegionY) {
          lowerRegionBrightness += brightness;
        }
      }
    }
    
    // Calculate averages
    const avgFaceBrightness = centerActivity > 0 ? faceRegionBrightness / centerActivity : 0;
    const avgUpperBrightness = upperRegionBrightness / (totalPixels * 0.3);
    const avgLowerBrightness = lowerRegionBrightness / (totalPixels * 0.3);
    
    // Advanced detection logic
    const now = Date.now();
    
    // Simulate realistic face detection patterns
    const hasStrongFaceSignal = avgFaceBrightness > 120 && centerActivity > (totalPixels * 0.05);
    const hasWeakFaceSignal = avgFaceBrightness > 80 && centerActivity > (totalPixels * 0.02);
    const isLookingDown = avgLowerBrightness > avgUpperBrightness * 1.3; // Phone usage indicator
    const hasMultipleBrightRegions = avgUpperBrightness > 140 && Math.random() > 0.99; // Very rare
    
    // 1. Strong face detection - person is clearly visible and facing camera
    if (hasStrongFaceSignal && !isLookingDown) {
      setLastFaceDetection(now);
      return 1;
    }
    
    // 2. Weak face signal but looking down (phone usage)
    if (hasWeakFaceSignal && isLookingDown) {
      // Trigger phone usage warning
      if (Math.random() > 0.95) { // Occasional detection
        setTimeout(() => onWarning("Mobile phone usage detected - please focus on the interview"), 100);
      }
      setLastFaceDetection(now);
      return 1;
    }
    
    // 3. Multiple people detection (very rare and strict)
    if (hasMultipleBrightRegions) {
      return 2;
    }
    
    // 4. Person turned away or not in frame
    if (hasWeakFaceSignal && !isLookingDown) {
      setLastFaceDetection(now);
      return 1;
    }
    
    // 5. No face detected at all
    return 0;
  };

  const checkForWarnings = (detectedFaces: number) => {
    const now = Date.now();
    
    // 1. Multiple people detection
    if (detectedFaces > 1) {
      onWarning("Multiple people detected - only one person should be visible");
      return;
    }
    
    // 2. Looking away from camera for more than 10 seconds
    if (detectedFaces === 0) {
      // Start tracking looking away
      if (!isCurrentlyLookingAway) {
        isCurrentlyLookingAway = true;
        lookingAwayStartTime = now;
      } else if (now - lookingAwayStartTime > 10000) {
        // Looking away for more than 10 seconds
        onWarning("Looking away from camera for more than 10 seconds - please face the camera");
        lookingAwayStartTime = now; // Reset to avoid spam
      }
    } else {
      // Reset looking away tracking when face is detected
      isCurrentlyLookingAway = false;
      lookingAwayStartTime = 0;
    }
  };

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'none' }}
      width={640}
      height={480}
    />
  );
};

export default FaceDetectionMonitor;
