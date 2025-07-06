
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Mail } from "lucide-react";
import OTPVerification from "./OTPVerification";
import { OTPService } from "@/service/otp.service";
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

interface CandidateInfoFormProps {
  onComplete: () => void;
  formData: {
    name: string;
    email: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
  }>>;
}

const CandidateInfoForm = ({ onComplete, formData, setFormData }: CandidateInfoFormProps) => {
  const navigate = useNavigate();
  const { interviewType } = useParams();
  const [showOTP, setShowOTP] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    const result = await OTPService.generateOTPService({ name: formData.name, email: formData.email, interview_id : interviewType! });
    console.log("kjhgugresultotptrigger=>:", result);
    if (result?.success) {
      toast({
        title: "OTP Sent",
        description: `${result.message} "${formData.email}"`,
      });
      setShowOTP(true);
      setIsSubmitting(false);
    } else {
      toast({
        title: "Error",
        description: result?.message || 'Bad Request!',
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
    // navigate('/alreadySubmit');
    

    
    // Simulate sending OTP
    // setTimeout(() => {
    //   localStorage.setItem('candidateInfo', JSON.stringify(formData));
    //   toast({
    //     title: "OTP Sent",
    //     description: `Verification code sent to ${formData.email}`,
    //   });
    //   setShowOTP(true);
    //   setIsSubmitting(false);
    // }, 2000);


  };

  const handleOTPVerified = () => {
    toast({
      title: "Email Verified",
      description: "Proceeding to device check...",
    });
    onComplete();
  };

  const handleBackFromOTP = () => {
    setShowOTP(false);
  };

  if (showOTP) {
    return (
      <OTPVerification
        email={formData.email}
        interviewid={interviewType!}
        onVerified={handleOTPVerified}
        onBack={handleBackFromOTP}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white/95 border-orange-200 shadow-2xl">
        <CardHeader className="bg-orange-500 text-white rounded-t-lg">
          <CardTitle className="text-2xl text-center flex items-center justify-center">
            <Shield className="h-8 w-8 mr-3" />
            Candidate Information
          </CardTitle>
          <p className="text-orange-100 text-center">
            Enter your details to begin the interview process
          </p>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700 font-medium">Full Name *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="h-12 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="h-12 border-orange-200 focus:border-orange-500 focus:ring-orange-500"
                placeholder="Enter your email address"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white text-lg font-medium flex items-center justify-center"
            >
              {isSubmitting ? (
                "Sending OTP..."
              ) : (
                <>
                  <Mail className="h-5 w-5 mr-2" />
                  Send Verification Code
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-gray-600 text-center">
              A verification code will be sent to your email address to confirm your identity before the interview begins.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidateInfoForm;
