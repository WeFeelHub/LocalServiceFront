'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5005'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function deleteCamera(ID_CAMERA) {
  api.delete(`/deletarCamera/${ID_CAMERA}`)
    .then(response => {
      console.log('Câmera deletada com sucesso:', response.data);
    })
    .catch(error => {
      console.error('Erro ao deletar a câmera:', error);
    });
}

export function Camera() {
  const [cameraName, setCameraName] = useState('');
  const [cameraLocation, setCameraLocation] = useState('');
  const [cameraDate, setCameraDate] = useState('');
  const [cameraDuration, setCameraDuration] = useState('');
  const [cameraType, setCameraType] = useState('');
  const [cameras, setCameras] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);
  const [captureInterval, setCaptureInterval] = useState(5); // Default to 5 seconds
  const [isCapturing, setIsCapturing] = useState(false);
  const [mediaDevices, setMediaDevices] = useState([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const captureIntervalRef = useRef(null);
  const [cameraTimer, setCameraTimer] = useState(null);
  const [initialCameraDuration, setInitialCameraDuration] = useState(0); // Estado para duração inicial da câmera
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(false); // Estado de carregamento
  const [editingCamera, setEditingCamera] = useState(null); // Estado para edição de câmera

  const handleDeleteCamera = useCallback((ID_CAMERA) => {
    deleteCamera(ID_CAMERA);
    setCameras(prevCameras => prevCameras.filter(camera => camera.ID_CAMERA !== ID_CAMERA));
  }, []);

  const startCamera = useCallback((deviceIndex) => {
    if (mediaDevices.length > 0) {
      const constraints = {
        video: { deviceId: { exact: mediaDevices[deviceIndex].deviceId } }
      };
      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          const video = videoRef.current;
          if (video) {
            video.srcObject = stream;
            video.oncanplay = () => {
              video.play().catch(error => console.error('Erro ao tentar reproduzir o vídeo:', error));
            };
          }
        })
        .catch(error => {
          console.error('Erro ao acessar a câmera:', error);
        });
    }
  }, [mediaDevices]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setMediaDevices(videoDevices);
      })
      .catch(error => {
        console.error('Erro ao enumerar dispositivos:', error);
      });
  }, []);

  useEffect(() => {
    if (cameraTimer > 0) {
      const timer = setTimeout(() => {
        setCameraTimer(cameraTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (cameraTimer === 0) {
      stopCapturing();
    }
  }, [cameraTimer]);

  const startCapturing = useCallback(() => {
    setIsCapturing(true);
    setCameraTimer(initialCameraDuration); // Set the timer to the initial duration when starting capture
    captureImage();
    captureIntervalRef.current = setInterval(captureImage, captureInterval * 1000);
  }, [captureInterval, initialCameraDuration]);

  const stopCapturing = useCallback(() => {
    setIsCapturing(false);
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
    }
    setCameraTimer(null); // Reset the timer
  }, []);

  const captureImage = useCallback(() => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const image = canvas.toDataURL('image/png');
    const base64Image = image.replace(/^data:image\/(png|jpeg);base64,/, '');
    setCapturedImage(image);

    const token = localStorage.getItem('token');
    axios.post('http://127.0.0.1:5006/upload', {
      image: base64Image,
     // ID_EVENTO: selectedEvent // Inclui o ID do evento na solicitação
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      console.log('Imagem enviada com sucesso:', response.data);
    }).catch(error => {
      console.error('Erro ao enviar imagem:', error);
    });
  }, []);

  const handleNextCamera = useCallback(() => {
    const nextIndex = (currentDeviceIndex + 1) % mediaDevices.length;
    setCurrentDeviceIndex(nextIndex);
    startCamera(nextIndex);
  }, [currentDeviceIndex, mediaDevices.length, startCamera]);

  return (
    <div>
      <video ref={videoRef} className="w-full h-auto mb-4"></video>
      <div className="text-sm font-semibold mb-2">Nome da Câmera: {cameraName}</div>
      <div className="text-sm font-semibold mb-2">Tempo Restante: {cameraTimer !== null ? cameraTimer : cameraDuration * 60} segundos</div>
      <label className="block mb-2 text-sm font-medium text-gray-900">Intervalo entre capturas (segundos):</label>
      <input
        type="number"
        className="border border-gray-300 rounded-md p-2 w-[20vw] mb-4"
        value={captureInterval}
        onChange={(e) => setCaptureInterval(Number(e.target.value))}
        min="1"
      />
      <div className="flex justify-center space-x-2">
        <button
          id="start-capture-button"
          className="bg-indigo-600 text-white rounded-md px-4 py-2 text-sm"
          onClick={startCapturing}
          disabled={isCapturing}
        >
          Iniciar Captura
        </button>
        {cameras.length > 1 && mediaDevices.length > 1 && (
          <button
            className="bg-indigo-600 text-white rounded-md px-4 py-2 text-sm"
            onClick={handleNextCamera}
          >
            Próxima Câmera
          </button>
        )}
      </div>
      <button
        className="bg-gray-600 text-white rounded-md px-4 py-2 text-sm mt-2"
        onClick={stopCapturing}
      >
        Parar Captura
      </button>
    </div>
  );
}


