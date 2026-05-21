import { useRef, useState } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface VoiceCapturedPayload {
  id: string;
  title: string | null;
  body: string;
}

const VoiceCaptureButton = ({ ventureSlug, onCaptured, fullWidth }: { ventureSlug?: string; onCaptured?: (c: VoiceCapturedPayload) => void; fullWidth?: boolean }) => {
  const [state, setState] = useState<"idle" | "recording" | "processing">("idle");
  const [secs, setSecs] = useState(0);
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const tickRef = useRef<number | null>(null);
  const qc = useQueryClient();

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm";
      const rec = new MediaRecorder(stream, { mimeType: mime });
      chunksRef.current = [];
      rec.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        if (tickRef.current) { window.clearInterval(tickRef.current); tickRef.current = null; }
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        if (blob.size < 200) { setState("idle"); setSecs(0); toast.error("Too short"); return; }
        setState("processing");
        const buf = await blob.arrayBuffer();
        // base64 chunked
        let bin = "";
        const bytes = new Uint8Array(buf);
        const chunk = 0x8000;
        for (let i = 0; i < bytes.length; i += chunk) {
          bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk) as unknown as number[]);
        }
        const b64 = btoa(bin);
        const { data, error } = await supabase.functions.invoke("voice-capture", {
          body: { audio: b64, format: "webm", venture_slug: ventureSlug },
        });
        setState("idle"); setSecs(0);
        if (error || data?.error) { toast.error(error?.message || data?.error || "Failed"); return; }
        toast.success(data?.title || "Voice captured");
        qc.invalidateQueries({ queryKey: ["captures"] });
        if (data?.capture && onCaptured) {
          onCaptured({ id: data.capture.id, title: data.capture.title ?? null, body: data.capture.body ?? data.transcript ?? "" });
        }
      };
      rec.start();
      recRef.current = rec;
      setState("recording");
      setSecs(0);
      tickRef.current = window.setInterval(() => setSecs((s) => s + 1), 1000);
    } catch (e: any) {
      toast.error(e?.message || "Mic blocked");
    }
  };

  const stop = () => recRef.current?.stop();

  const baseLayout = fullWidth ? "w-full justify-center" : "";
  if (state === "processing") {
    return (
      <button disabled className={`inline-flex items-center gap-2 px-3 py-2 rounded-md bg-secondary text-xs font-medium ${baseLayout}`}>
        <Loader2 size={14} className="animate-spin" /> Transcribing…
      </button>
    );
  }
  if (state === "recording") {
    return (
      <button onClick={stop} className={`inline-flex items-center gap-2 px-3 py-2 rounded-md bg-destructive text-destructive-foreground text-xs font-medium animate-pulse ${baseLayout}`}>
        <Square size={12} fill="currentColor" /> Stop · {secs}s
      </button>
    );
  }
  return (
    <button onClick={start} className={`inline-flex items-center gap-2 px-3 py-2 rounded-md bg-foreground text-background text-xs font-medium hover:opacity-90 ${baseLayout}`}>
      <Mic size={14} /> Voice note
    </button>
  );
};

export default VoiceCaptureButton;
