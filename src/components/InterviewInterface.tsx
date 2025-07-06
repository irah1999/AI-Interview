
import InterviewSession from "./interview/InterviewSession";

interface InterviewInterfaceProps {
  onExit: () => void;
  formData: {
    name: string;
    email: string;
  };
}

const InterviewInterface = ({ onExit, formData }: InterviewInterfaceProps) => {
  return <InterviewSession onExit={onExit} formData={formData}/>;
};

export default InterviewInterface;
