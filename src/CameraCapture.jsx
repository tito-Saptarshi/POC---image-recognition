import { useEffect, useRef, useCallback } from "react";
import { Button } from "./components/ui/button";

export default function CameraCapture({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

const stopStream = useCallback(() => {
  console.log('Stopping stream...'); // Debug
  if (streamRef.current) {
    const tracks = streamRef.current.getTracks();
    console.log(`Stopping ${tracks.length} tracks`); // Should be 1 (video)
    tracks.forEach((track, i) => {
      console.log(`Stopping track ${i}:`, track.kind, track.readyState); // Check 'live'/'ended'
      track.stop();
    });
    streamRef.current = null;
  }
  if (videoRef.current) {
    videoRef.current.srcObject = null;
    videoRef.current.pause(); // Extra pause
  }
  console.log('Stream stopped'); // Confirm
}, []);


  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(console.error);

    return () => {
      stopStream();
    };
  }, [stopStream]);

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
      onCapture(file);
      stopStream(); // Stop immediately after capture
    });
  };

  const handleClose = () => {
    stopStream();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex justify-center gap-4 bg-black">
        <Button
          onClick={capture}
          className="bg-white text-black px-8 py-3 rounded-full"
        >
          Capture
        </Button>

        <Button
          onClick={handleClose}
          className="bg-red-500 text-white px-6 py-3 rounded-full"
        >
          Cancel
        </Button>
      </div>

      <canvas ref={canvasRef} hidden />
    </div>
  );
}
