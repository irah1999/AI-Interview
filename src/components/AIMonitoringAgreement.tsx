import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, Eye, Camera, AlertTriangle, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIMonitoringAgreementProps {
  onAgree: () => void;
  onCancel: () => void;
}

const AIMonitoringAgreement = ({ onAgree, onCancel }: AIMonitoringAgreementProps) => {
  const [agreed, setAgreed] = useState(false);
  const { toast } = useToast();

  const handleAgree = () => {
    if (!agreed) {
      toast({
        title: "Agreement Required",
        description: "Please check the agreement checkbox to proceed.",
        variant: "destructive"
      });
      return;
    }
    onAgree();
  };

  const monitoringRules = [
    {
      icon: <Camera className="h-5 w-5 text-orange-500" />,
      title: "Face Detection",
      description: "Your face must remain visible in the camera at all times during the interview."
    },
    {
      icon: <Clock className="h-5 w-5 text-orange-500" />,
      title: "Looking Away Detection",
      description: "Looking away from the camera for more than 10 seconds will trigger a warning."
    },
    {
      icon: <Users className="h-5 w-5 text-orange-500" />,
      title: "Multiple People Detection",
      description: "Only one person should be visible in the camera frame. Multiple people will be flagged."
    },
    {
      icon: <Eye className="h-5 w-5 text-orange-500" />,
      title: "Mobile Phone Usage",
      description: "Looking down at mobile devices or phones during the interview is not permitted."
    },
    {
      icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
      title: "Background Activity",
      description: "Unusual movements or activities in the background will be monitored and flagged."
    },
    {
      icon: <Shield className="h-5 w-5 text-orange-500" />,
      title: "Screenshot Capture",
      description: "Screenshots will be automatically captured and saved when warnings are triggered."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-white/95">
        <CardHeader className="bg-orange-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Shield className="h-6 w-6" />
            <span>AI Monitoring Rules & Agreement</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Interview Monitoring System
            </h2>
            <p className="text-gray-600">
              Our AI-powered monitoring system ensures interview integrity. Please read and understand the following rules before proceeding.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {monitoringRules.map((rule, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border">
                <div className="flex-shrink-0 mt-1">
                  {rule.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{rule.title}</h3>
                  <p className="text-sm text-gray-600">{rule.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Important Notice</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• All warnings and incidents will be logged and reported</li>
                  <li>• Screenshots will be captured and stored securely in Google Drive</li>
                  <li>• Multiple warnings may result in interview termination</li>
                  <li>• This session will be recorded for quality and security purposes</li>
                  <li>• You must be in a quiet, well-lit environment with minimal distractions</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg">
            <Checkbox
              id="agreement"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
            />
            <label htmlFor="agreement" className="text-sm text-gray-700 cursor-pointer">
              I have read and understood all the AI monitoring rules and agree to comply with them during the interview. 
              I consent to being monitored and recorded for the duration of this interview session.
            </label>
          </div>

          <div className="flex justify-center space-x-4">
            <Button 
              onClick={onCancel}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAgree}
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={!agreed}
            >
              I Agree - Proceed to Device Check
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIMonitoringAgreement;