import { Shield, AlertTriangle } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";

interface InterviewHeaderProps {
  candidateName: string;
  candidateEmail: string;
  isRecording: boolean;
  formattedTime: string;
  warningCount: number;
}

const InterviewHeader = ({ 
  candidateName, 
  candidateEmail, 
  isRecording, 
  formattedTime, 
  warningCount 
}: InterviewHeaderProps) => {
  return (
    <div className="bg-primary p-4 flex justify-between items-center border-b border-primary/20 shadow-lg">
      <div className="flex items-center space-x-4">
        <Shield className="h-6 w-6 text-primary-foreground" />
        <div>
          <h2 className="text-primary-foreground font-semibold">{candidateName}</h2>
          <p className="text-primary-foreground/80 text-sm">{candidateEmail}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className={`h-3 w-3 rounded-full ${isRecording ? 'bg-red-400 animate-pulse' : 'bg-muted'}`} />
          <span className="text-primary-foreground text-sm">{isRecording ? 'Recording' : 'Not Recording'}</span>
        </div>
        
        <div className="text-primary-foreground font-mono text-lg bg-primary/80 px-3 py-1 rounded">
          {formattedTime}
        </div>
        
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-300" />
          <span className="text-primary-foreground text-sm">Warnings: {warningCount}</span>
        </div>

        <ThemeToggle />
      </div>
    </div>
  );
};

export default InterviewHeader;