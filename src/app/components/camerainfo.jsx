// components/CameraInfo.js
import React from 'react';

function CameraInfo({ camera }) {
  return (
    <div className="camera-info">
      <p><strong>Nome da Câmera:</strong> {camera.NM_CAMERA}</p>
      <p><strong>Tipo de Plano:</strong> {camera.TP_PLANO}</p>
      <p><strong>Localização:</strong> {camera.DS_LOCALIZACAO}</p>
    </div>
  );
}

export default CameraInfo;
