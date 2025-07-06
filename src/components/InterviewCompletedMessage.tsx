import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock } from "lucide-react";

interface InterviewCompletedMessageProps {
  onBackToHome: () => void;
}

const InterviewCompletedMessage = ({ onBackToHome }: InterviewCompletedMessageProps) => {
  const getCompletionDetails = () => {
    const completed = localStorage.getItem('interviewCompleted');
    const feedback = localStorage.getItem('interviewFeedback');
    
    if (completed) {
      const completedData = JSON.parse(completed);
      const completedDate = new Date(completedData.completedAt).toLocaleDateString();
      const completedTime = new Date(completedData.completedAt).toLocaleTimeString();
      
      return {
        date: completedDate,
        time: completedTime,
        hasFeedback: !!feedback
      };
    }
    
    return null;
  };

  const details = getCompletionDetails();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 text-center">
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-center space-x-2">
            <CheckCircle className="h-6 w-6" />
            <span>Interview Already Submitted</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800">
              You have already completed your interview
            </h2>
            
            <p className="text-gray-600">
              Your interview session was successfully submitted and cannot be retaken.
            </p>
            
            {details && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Completed on {details.date} at {details.time}</span>
                </div>
                {details.hasFeedback && (
                  <p className="text-xs text-green-600">
                    ✓ Feedback submitted
                  </p>
                )}
              </div>
            )}
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

export default InterviewCompletedMessage;