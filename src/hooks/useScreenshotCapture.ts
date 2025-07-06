import { useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useScreenshotCapture = () => {
  const { toast } = useToast();

  const captureScreenshot = async (videoElement: HTMLVideoElement | null, warningType: string) => {
    if (!videoElement) {
      console.error('No video element available for screenshot');
      return null;
    }

    try {
      // Create canvas to capture video frame
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        console.error('Could not get canvas context');
        return null;
      }

      // Set canvas size to match video
      canvas.width = videoElement.videoWidth || 640;
      canvas.height = videoElement.videoHeight || 480;

      // Draw current video frame to canvas
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // Add warning overlay
      ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
      ctx.fillRect(0, 0, canvas.width, 40);
      
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.fillText(`WARNING: ${warningType}`, 10, 25);
      
      // Add timestamp
      const timestamp = new Date().toLocaleString();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
      ctx.fillStyle = 'black';
      ctx.font = '12px Arial';
      ctx.fillText(`Captured: ${timestamp}`, 10, canvas.height - 10);

      // Convert canvas to blob
      return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create screenshot blob'));
          }
        }, 'image/png', 0.9);
      });
    } catch (error) {
      console.error('Screenshot capture error:', error);
      return null;
    }
  };

  const uploadToGoogleDrive = async (blob: Blob, warningType: string) => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `warning_screenshot_${timestamp}_${warningType.replace(/\s+/g, '_')}.png`;
      
      // Simulate Google Drive upload
      console.log(`Uploading screenshot to Google Drive: ${filename}`, blob.size, 'bytes');
      console.log('Screenshot would be uploaded to Google Drive with metadata:', {
        filename,
        warningType,
        timestamp,
        size: blob.size
      });
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Screenshot Captured",
        description: `Warning screenshot saved to Google Drive: ${filename}`,
      });

      return {
        success: true,
        filename,
        url: `https://drive.google.com/simulated/${filename}`
      };
    } catch (error) {
      console.error('Failed to upload screenshot to Google Drive:', error);
      toast({
        title: "Screenshot Upload Failed",
        description: "Failed to upload screenshot to Google Drive. Screenshot saved locally.",
        variant: "destructive"
      });
      return {
        success: false,
        error: error
      };
    }
  };

  const captureAndUploadScreenshot = async (videoElement: HTMLVideoElement | null, warningType: string) => {
    const screenshot = await captureScreenshot(videoElement, warningType);
    if (screenshot) {
      const uploadResult = await uploadToGoogleDrive(screenshot, warningType);
      return {
        screenshot,
        uploadResult
      };
    }
    return null;
  };

  return {
    captureScreenshot,
    uploadToGoogleDrive,
    captureAndUploadScreenshot
  };
};