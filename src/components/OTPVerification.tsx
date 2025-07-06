
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Mail, RotateCcw } from "lucide-react";
import OTPInput from '@/components/OTPInput';
import { OTPService } from "@/service/otp.service";

interface OTPVerificationProps {
  email: string;
  interviewid: string;
  onVerified: () => void;
  onBack: () => void;
}

const OTPVerification = ({ email,interviewid, onVerified, onBack }: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const { toast } = useToast();
  const [otpComplete, setOtpComplete] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit OTP code.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    const result = await OTPService.verifyOTPService({ email, otp, interview_id: interviewid });
    console.log("OTP Verification:", result);

    if (result?.success) {
      toast({
        title: "OTP Verification",
        description: result?.message || "Proceeding to device check...",
      });
      setTimeout(() => {
        onVerified();
        setIsVerifying(false);
      }, 2000);
    } else {
      toast({
        title: "OTP Verification",
        description: result?.message || "Please check your OTP and try again.",
        variant: "destructive"
      });
      setIsVerifying(false);
    }
    // Simulate OTP verification
    // setTimeout(() => {
    //   if (otp === "123456") { // For demo purposes
    //     toast({
    //       title: "OTP Verified",
    //       description: "Proceeding to device check...",
    //     });
    //     onVerified();
    //   } else {
    //     toast({
    //       title: "Invalid OTP",
    //       description: "Please check your OTP and try again.",
    //       variant: "destructive"
    //     });
    //   }
    // }, 2000);


  };

  const handleResendOTP = () => {
    setTimeLeft(300);
    setCanResend(false);
    toast({
      title: "OTP Resent",
      description: `A new OTP has been sent to ${email}`,
    });
  };

  const handleOTPComplete = (completedOtp: string) => {
    console.log('OTP completed:', completedOtp);
    setOtpComplete(true);
  };
  const handleOTPChange = (currentOtp: string) => {
    setOtp(currentOtp);
    if (currentOtp.length == 6) {
      setOtpComplete(true);
    } else {
      setOtpComplete(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 border-orange-200 shadow-2xl">
        <CardHeader className="bg-orange-500 text-white rounded-t-lg text-center">
          <CardTitle className="flex items-center justify-center">
            <Mail className="h-6 w-6 mr-2" />
            Verify OTP
          </CardTitle>
          <p className="text-orange-100 text-sm">
            Enter the 6-digit code sent to {email}
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-gray-700">OTP Code</Label>
              <OTPInput
                length={6}
                onComplete={handleOTPComplete}
                onChange={handleOTPChange}
                className="justify-center"
              />
            </div>

            <div className="text-center text-sm text-gray-600">
              {timeLeft > 0 ? (
                <p>Code expires in: <span className="font-mono text-orange-600">{formatTime(timeLeft)}</span></p>
              ) : (
                <p className="text-red-600">OTP has expired</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isVerifying || otp.length !== 6}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </Button>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                Back
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleResendOTP}
                disabled={!canResend}
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Resend OTP
              </Button>
            </div>
          </form>

          {/* <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-gray-600 text-center">
              <strong>For demo:</strong> Use OTP code <span className="font-mono bg-orange-200 px-2 py-1 rounded">123456</span>
            </p>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPVerification;
