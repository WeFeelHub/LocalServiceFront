'use client';

// components/Camera.js
import { useRef, useEffect, useState } from 'react';

export default function Camera() {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  useEffect(() => {
    if (isCameraOn) {
      async function getMedia() {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } catch (err) {
          console.error('Error accessing the camera', err);
        }
      }

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        getMedia();
      } else {
        console.error('Browser does not support getUserMedia API');
      }
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  }, [isCameraOn]);

  const handleCameraToggle = () => {
    setIsCameraOn(!isCameraOn);
  };

  return (
    <div className="flex flex-col items-center">
      <video ref={videoRef} autoPlay playsInline className="w-full max-w-lg border-2 border-gray-300 rounded-lg mb-4" />
      <button onClick={handleCameraToggle} className="px-6 py-2 text-lg font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-700">
        {isCameraOn ? 'Desligar Câmera' : 'Ligar Câmera'}
      </button>
    </div>
  );
}
