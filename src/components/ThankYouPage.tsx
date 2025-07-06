import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Heart } from "lucide-react";

interface ThankYouPageProps {
  onBackToHome: () => void;
}

const ThankYouPage = ({ onBackToHome }: ThankYouPageProps) => {
  useEffect(() => {
    // Auto-redirect after 10 seconds
    const timer = setTimeout(() => {
      onBackToHome();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onBackToHome]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 text-center">
        <CardHeader className="bg-green-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-center space-x-2">
            <CheckCircle className="h-6 w-6" />
            <span>Thank You!</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8 text-green-500" />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800">
              Thank you for your valuable time!
            </h2>
            
            <p className="text-gray-600">
              Your interview has been successfully completed and your feedback has been recorded. 
              We appreciate your participation in our interview process.
            </p>
            
            <p className="text-sm text-gray-500">
              You will be redirected to the home page automatically in a few seconds.
            </p>
          </div>

          <Button 
            onClick={onBackToHome}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThankYouPage;