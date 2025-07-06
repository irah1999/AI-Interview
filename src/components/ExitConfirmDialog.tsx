
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface ExitConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ExitConfirmDialog = ({ open, onConfirm, onCancel }: ExitConfirmDialogProps) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="bg-slate-800 border-yellow-500">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-yellow-400 flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2" />
            Terminate Interview?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            Are you sure you want to terminate the interview? This action cannot be undone and 
            your interview session will be permanently ended. All recordings and data will be saved.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onCancel}
            className="bg-slate-700 text-white border-slate-600 hover:bg-slate-600"
          >
            No, Continue Interview
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Yes, End Interview
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExitConfirmDialog;
