'use client';

// components/Camera.js
import { useRef, useEffect, useState, useCallback } from 'react';
import axios from 'axios';

function Camera({ index, selectedEvent }) {
  const videoRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureInterval, setCaptureInterval] = useState(5); // Intervalo padrão de 5 segundos
  const [stream, setStream] = useState(null);

  useEffect(() => {
    async function getMedia() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error(`Error accessing the camera ${index}`, err);
      }
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      getMedia();
    } else {
      console.error('Browser does not support getUserMedia API');
    }
  }, [index]);

  const captureImage = useCallback(() => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const image = canvas.toDataURL('image/png');
    const base64Image = image.replace(/^data:image\/(png|jpeg);base64,/, '');

    const token = localStorage.getItem('token');
    axios.post('http://127.0.0.1:5006/upload', {
      image: base64Image,
      ID_EVENTO: selectedEvent
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      console.log('Imagem enviada com sucesso:', response.data);
    }).catch(error => {
      console.error('Erro ao enviar imagem:', error);
    });
  }, [selectedEvent]);

  const handleCaptureToggle = () => {
    setIsCapturing(true);
  };

  const handleStopCapture = () => {
    setIsCapturing(false);
  };

  useEffect(() => {
    let intervalId;
    if (isCapturing) {
      intervalId = setInterval(() => {
        captureImage();
      }, captureInterval * 1000); // Converter segundos para milissegundos
    } else {
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isCapturing, captureInterval, captureImage]);

  const handleIntervalChange = (e) => {
    setCaptureInterval(Number(e.target.value));
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <video ref={videoRef} autoPlay playsInline className="w-full max-w-lg border-2 border-gray-300 rounded-lg mb-2" />
      <div className="flex space-x-2">
        <button
          onClick={handleCaptureToggle}
          className={`px-4 py-2 text-sm font-semibold text-white rounded-lg ${
            isCapturing ? 'bg-red-500 hover:bg-red-700' : 'bg-blue-500 hover:bg-blue-700'
          }`}
        >
          Reconhecimento
        </button>
        <button
          onClick={handleStopCapture}
          className="px-4 py-2 text-sm font-semibold text-white bg-gray-500 rounded-lg hover:bg-gray-700"
        >
          Parar
        </button>
      </div>
      <div className="mt-2">
        <label className="mr-2">Intervalo de Captura (segundos):</label>
        <input
          type="number"
          value={captureInterval}
          onChange={handleIntervalChange}
          className="px-2 py-1 border rounded text-black"
        />
      </div>
    </div>
  );
}

export default function Cameras({ selectedEvent }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Camera index={1} selectedEvent={selectedEvent} />
      <Camera index={2} selectedEvent={selectedEvent} />
      <Camera index={3} selectedEvent={selectedEvent} />
      <Camera index={4} selectedEvent={selectedEvent} />
    </div>
  );
}
