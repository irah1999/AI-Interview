
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Mic, Monitor, CheckCircle, XCircle, AlertTriangle, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { detectMultipleScreens } from '@/utils/browserDetection';
import { logScreenViolation } from '@/utils/screenViolationLogger';

interface DeviceCheckProps {
  onComplete: (status: { camera: boolean; microphone: boolean; singleMonitor: boolean }) => void;
}

const DeviceCheck = ({ onComplete }: DeviceCheckProps) => {
  const [checks, setChecks] = useState({
    camera: { status: 'pending', message: 'Checking camera access...' },
    microphone: { status: 'pending', message: 'Checking microphone access...' },
    monitor: { status: 'pending', message: 'Verifying monitor setup...' }
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [microphoneLevel, setMicrophoneLevel] = useState(0);
  const [isTestingMicrophone, setIsTestingMicrophone] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();
  const { toast } = useToast();

  const steps = ['camera', 'microphone', 'monitor'];

  useEffect(() => {
    runDeviceChecks();
    return () => {
      cleanup();
    };
  }, []);

  const checkScreenConfiguration = async () => {
    try {
      // console.log('🔍 CRITICAL: Checking screen configuration during device check...');
      const hasMultipleScreens = await detectMultipleScreens();
      
      if (hasMultipleScreens) {
        // console.log('🚨 CRITICAL: EXTENDED DISPLAY DETECTED DURING DEVICE CHECK - BLOCKING INTERVIEW');
        
        // Log the violation
        await logScreenViolation(
          { interviewId: 'INT-DEV-CHECK', name: 'Device Check' },
          'extended_screen_detected',
          'device_check_screen_verification',
          'interview_terminated'
        );

        
        
        // setScreenStatus('error');
        return false;
      } else {
        return true;
        // console.log('✅ CRITICAL: Single screen configuration verified during device check');
        // setScreenStatus('success');
      }
    } catch (error) {
      console.error('CRITICAL: Error checking screen configuration:', error);
      return false;
      // setScreenStatus('error');
    }
  };

  setInterval(checkScreenConfiguration, 1000);

  const cleanup = () => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  // const checkMonitorSetup = async () => {
  //   try {
  //     // Enhanced monitor detection for extended displays
  //     const screenWidth = screen.width;
  //     const screenHeight = screen.height;
  //     const availWidth = screen.availWidth;
  //     const availHeight = screen.availHeight;
      
  //     // Check for extended displays using multiple methods
  //     const hasExtendedWidth = screenWidth > 1920; // Standard single monitor max width
  //     const hasExtendedHeight = screenHeight > 1200; // Standard single monitor max height
  //     const hasUltraWideDisplay = screenWidth / screenHeight > 2.5; // Ultra-wide aspect ratio
  //     const hasSignificantWidthDiff = Math.abs(screenWidth - availWidth) > 50;
  //     const hasSignificantHeightDiff = Math.abs(screenHeight - availHeight) > 150; // Taskbar tolerance
      
  //     // Additional checks for extended desktop
  //     const totalScreenArea = screenWidth * screenHeight;
  //     const isUnusuallyLarge = totalScreenArea > (1920 * 1200); // Larger than standard single monitor
      
  //     // Detect multiple monitors through various indicators
  //     const hasMultipleMonitors = 
  //       hasExtendedWidth || 
  //       hasExtendedHeight || 
  //       hasUltraWideDisplay || 
  //       hasSignificantWidthDiff || 
  //       (hasSignificantHeightDiff && screenHeight > 1200) ||
  //       isUnusuallyLarge;
      
  //     console.log('Monitor Detection:', {
  //       screenWidth,
  //       screenHeight,
  //       availWidth,
  //       availHeight,
  //       hasExtendedWidth,
  //       hasExtendedHeight,
  //       hasUltraWideDisplay,
  //       hasSignificantWidthDiff,
  //       hasSignificantHeightDiff,
  //       isUnusuallyLarge,
  //       hasMultipleMonitors
  //     });
      
  //     return !hasMultipleMonitors;
  //   } catch (error) {
  //     console.log('Monitor detection error:', error);
  //     // Return false (fail check) if we can't detect properly for security
  //     return false;
  //   }
  // };

  const testMicrophoneFrequency = async (stream: MediaStream) => {
    try {
      setIsTestingMicrophone(true);
      micStreamRef.current = stream;
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const monitorAudio = () => {
        if (analyserRef.current && isTestingMicrophone) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
          setMicrophoneLevel(Math.round((average / 255) * 100));
          animationFrameRef.current = requestAnimationFrame(monitorAudio);
        }
      };
      
      monitorAudio();
      
      setTimeout(() => {
        setIsTestingMicrophone(false);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      }, 5000);
      
    } catch (error) {
      console.error('Microphone frequency test error:', error);
      setIsTestingMicrophone(false);
    }
  };

  const runDeviceChecks = async () => {
    setChecks({
      camera: { status: 'pending', message: 'Checking camera access...' },
      microphone: { status: 'pending', message: 'Checking microphone access...' },
      monitor: { status: 'pending', message: 'Verifying monitor setup...' }
    });
    setCurrentStep(0);
    setMicrophoneLevel(0);
    cleanup();

    // Optimized camera check with high performance settings
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
          frameRate: { ideal: 30, max: 60 },
          facingMode: 'user'
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
        } catch (playError) {
          console.log('Video play error:', playError);
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.play().catch(console.error);
            }
          }, 100);
        }
      }
      
      setChecks(prev => ({
        ...prev,
        camera: { status: 'success', message: 'Camera is working properly' }
      }));
      setCurrentStep(1);
      
      // Microphone Check with enhanced audio testing
      setTimeout(async () => {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
              sampleRate: 44100
            }
          });
          
          await testMicrophoneFrequency(audioStream);
          
          setChecks(prev => ({
            ...prev,
            microphone: { status: 'success', message: 'Microphone access granted and tested' }
          }));
          setCurrentStep(2);
          
          // Monitor Check
          setTimeout(async () => {
            const isSingleMonitor = await checkScreenConfiguration();
            
            setChecks(prev => ({
              ...prev,
              monitor: { 
                status: isSingleMonitor ? 'success' : 'error', 
                message: isSingleMonitor ? 'Single monitor detected' : 'Extended monitor detected - Please disconnect all additional monitors and retry' 
              }
            }));
            setCurrentStep(3);
          }, 1500);
          
        } catch (error) {
          setChecks(prev => ({
            ...prev,
            microphone: { status: 'error', message: 'Microphone access denied' }
          }));
          setCurrentStep(2);
        }
      }, 2000);
      
    } catch (error) {
      console.error('Camera check error:', error);
      setChecks(prev => ({
        ...prev,
        camera: { status: 'error', message: 'Camera access denied or unavailable' }
      }));
      setCurrentStep(1);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-400" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-400" />;
      default:
        return <div className="h-6 w-6 rounded-full bg-gray-400 animate-pulse" />;
    }
  };

  const canProceed = () => {
    return checks.camera.status === 'success' && 
           checks.microphone.status === 'success' && 
           checks.monitor.status === 'success'; // Only allow if single monitor
  };

  const handleProceed = () => {
    if (canProceed()) {
      cleanup();
      onComplete({
        camera: checks.camera.status === 'success',
        microphone: checks.microphone.status === 'success',
        singleMonitor: checks.monitor.status === 'success'
      });
      
      toast({
        title: "Device check completed",
        description: "All systems verified. Starting interview...",
      });
    }
  };

  const handleRetry = () => {
    toast({
      title: "Retrying device checks",
      description: "Running all device checks again...",
    });
    runDeviceChecks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-white/95 border-orange-200 shadow-2xl">
        <CardHeader className="bg-orange-500 text-white rounded-t-lg">
          <CardTitle className="text-2xl text-center">System Check</CardTitle>
          <p className="text-orange-100 text-center">
            Please ensure all devices are working properly before starting your interview
          </p>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          {/* Video Preview */}
          <div className="text-center">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              webkit-playsinline="true"
              className="w-80 h-60 bg-gray-200 rounded-lg mx-auto border-2 border-orange-300 shadow-lg"
              style={{ 
                transform: 'scaleX(-1)',
                objectFit: 'cover' as const
              }}
            />
            <p className="text-gray-600 text-sm mt-2">Camera Preview</p>
          </div>

          {/* Check Results */}
          <div className="space-y-4">
            {/* Camera Check */}
            <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <Camera className="h-8 w-8 text-orange-500" />
              <div className="flex-1">
                <h3 className="text-gray-800 font-semibold">Camera Check</h3>
                <p className="text-gray-600 text-sm">{checks.camera.message}</p>
              </div>
              {getStatusIcon(checks.camera.status)}
            </div>

            {/* Microphone Check */}
            <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <Mic className="h-8 w-8 text-orange-500" />
              <div className="flex-1">
                <h3 className="text-gray-800 font-semibold">Microphone Check</h3>
                <p className="text-gray-600 text-sm">{checks.microphone.message}</p>
                {isTestingMicrophone && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-gray-500 font-medium">Audio Level:</span>
                      <div className="flex-1 bg-gray-300 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-orange-400 to-orange-600 h-full rounded-full transition-all duration-150 ease-out" 
                          style={{ width: `${Math.min(microphoneLevel, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 font-medium min-w-[40px]">{microphoneLevel}%</span>
                    </div>
                    <p className="text-xs text-orange-600 font-medium animate-pulse">🎤 Speak to test your microphone</p>
                  </div>
                )}
              </div>
              {getStatusIcon(checks.microphone.status)}
            </div>

            {/* Monitor Check */}
            <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <Monitor className="h-8 w-8 text-orange-500" />
              <div className="flex-1">
                <h3 className="text-gray-800 font-semibold">Monitor Setup</h3>
                <p className="text-gray-600 text-sm">{checks.monitor.message}</p>
              </div>
              {getStatusIcon(checks.monitor.status)}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`h-2 w-8 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleRetry}
              variant="outline"
              className="border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Retry Checks
            </Button>
            
            <Button
              onClick={handleProceed}
              disabled={!canProceed()}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 disabled:opacity-50 disabled:bg-gray-400"
            >
              {canProceed() ? 'Start Interview' : 'Running System Checks...'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeviceCheck;
