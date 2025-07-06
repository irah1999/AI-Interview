
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface WarningDialogProps {
  open: boolean;
  onClose: () => void;
  warningType: string;
  warningCount: number;
}

const WarningDialog = ({ open, onClose, warningType, warningCount }: WarningDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="bg-slate-800 border-red-500">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-400 flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2" />
            Behavior Warning #{warningCount}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            <strong className="text-red-400">{warningType}</strong>
            <br /><br />
            Please maintain proper interview conduct. This incident has been recorded and logged. 
            Multiple warnings may result in interview termination.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction 
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            I Understand
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WarningDialog;
