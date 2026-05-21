import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import VoiceCaptureButton from "./VoiceCaptureButton";

const QuickVoiceDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Voice memo</DialogTitle>
          <DialogDescription className="text-xs">
            Records, transcribes, and saves to your captures.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-6">
          <VoiceCaptureButton onCaptured={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickVoiceDialog;
