import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Smile, Meh, Frown, ThumbsUp } from "lucide-react";

interface FeedbackFormProps {
  onComplete: () => void;
}

const FeedbackForm = ({ onComplete }: FeedbackFormProps) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");
  const [feedbackText, setFeedbackText] = useState("");
  const { toast } = useToast();

  const emojiOptions = [
    { value: "excellent", icon: ThumbsUp, label: "Excellent", color: "text-green-500" },
    { value: "good", icon: Smile, label: "Good", color: "text-blue-500" },
    { value: "okay", icon: Meh, label: "Okay", color: "text-yellow-500" },
    { value: "poor", icon: Frown, label: "Poor", color: "text-red-500" },
  ];

  const handleSubmit = () => {
    if (!selectedEmoji) {
      toast({
        title: "Please select your experience",
        description: "Choose an emoji to rate your interview experience.",
        variant: "destructive"
      });
      return;
    }

    // Store feedback in localStorage
    const feedback = {
      rating: selectedEmoji,
      comments: feedbackText,
      submittedAt: new Date().toISOString()
    };
    
    localStorage.setItem('interviewFeedback', JSON.stringify(feedback));

    toast({
      title: "Feedback Submitted",
      description: "Thank you for your valuable feedback!",
    });

    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95">
        <CardHeader className="bg-orange-500 text-white rounded-t-lg">
          <CardTitle className="text-center">Interview Feedback</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <Label className="text-base font-medium mb-4 block">
              How was your interview experience?
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {emojiOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setSelectedEmoji(option.value)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                      selectedEmoji === option.value
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300"
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <IconComponent className={`h-8 w-8 ${option.color}`} />
                      <span className="text-sm font-medium">{option.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label htmlFor="feedback-text" className="text-base font-medium mb-2 block">
              Additional Comments (Optional)
            </Label>
            <Textarea
              id="feedback-text"
              placeholder="Share your thoughts about the interview process..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            Submit Feedback
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackForm;