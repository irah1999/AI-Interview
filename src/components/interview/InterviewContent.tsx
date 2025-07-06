import { useState, useEffect } from "react";
import { Monitor, Camera, Mic, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Interview } from "@/types/interview";
import Call from "@/components/call";

interface InterviewContentProps {
  onEndInterview: () => void;
  formData: {
    name: string;
    email: string;
  };
  interview: Interview;
  setConfirmEndInterview: React.Dispatch<React.SetStateAction<boolean>>;
  confirmEndInterview: boolean;
}

const InterviewContent = ({ onEndInterview, formData, interview, setConfirmEndInterview, confirmEndInterview }: InterviewContentProps) => {
  return (
    <div className="flex-1 p-4 flex flex-col space-y-2">
      {/* Main Interview Card */}
      <Card className="flex-1 bg-card border-border shadow-lg">
        <CardContent className="p-6 h-full flex flex-col items-center justify-center">
          <div className="mb-4 w-[98%] h-[98%]">
            <Call interview={interview} formData={formData} onEndInterview={onEndInterview} setConfirmEndInterview={setConfirmEndInterview} confirmEndInterview={confirmEndInterview}/>
          </div>
          <Monitor className="h-16 w-16 text-primary mb-6" />
          <h2 className="text-2xl font-bold text-card-foreground mb-4">Interview in Progress</h2>
          {/* <p className="text-muted-foreground text-center max-w-md mb-8">
            This area contains your interview questions. The AI system is actively monitoring for:
            <br />• Face presence in camera view
            <br />• Multiple people detection  
            <br />• Looking away for more than 10 seconds
            <br />• Mobile phone usage detection
            <br />• Suspicious behavior patterns
            <br />• Background activity
          </p> */}
          
          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="bg-muted p-4 rounded-lg text-center border border-border">
              <Camera className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-card-foreground font-semibold">Video</p>
              <p className="text-green-600 text-sm">Active</p>
            </div>
            <div className="bg-muted p-4 rounded-lg text-center border border-border">
              <Mic className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-card-foreground font-semibold">Audio</p>
              <p className="text-green-600 text-sm">Recording</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewContent;