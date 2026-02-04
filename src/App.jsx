import { useState } from "react";
import "./App.css";

import UploadOptions from "./UploadOptions";
import ResponseDisplay from "./ResponseDisplay";
import CameraCapture from "./CameraCapture";

import { sendImageToApi, sendZipToApi } from "./api";

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [apiResult, setApiResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const [showCamera, setShowCamera] = useState(false);
  const [pendingTitle, setPendingTitle] = useState(null);

  const handleCameraCapture = async (file) => {
    // preview
    const reader = new FileReader();
    reader.onloadend = () => setUploadedImage(reader.result);
    reader.readAsDataURL(file);

    setIsLoading(true);
    setApiResult(null);

    try {
      const result = await sendImageToApi({
        image: file,
        title: pendingTitle,
      });

      setApiResult(result);
    } catch (err) {
      console.error(err);
      setApiResult({ message: "Error", result: { label: "-", confidence: "-", price: "-" } });
    } finally {
      setIsLoading(false);
      setPendingTitle(null);
    }
  };

  const handleZipUpload = async (file) => {
    setIsLoading(true);
    setApiResult(null);

    try {
      const result = await sendZipToApi(file);
      setApiResult(result);
    } catch (err) {
      console.error(err);
      setApiResult({ message: "ZIP failed", result: { label: "-", confidence: "-", price: "-" } });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Upload & Process</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UploadOptions
          onOpenCamera={(title) => {
            setPendingTitle(title || null);
            setShowCamera(true);
          }}
          onZipUpload={handleZipUpload}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />

        <ResponseDisplay
          uploadedImage={uploadedImage}
          response={apiResult}
          isLoading={isLoading}
        />
      </div>

      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </main>
  );
}

export default App;
