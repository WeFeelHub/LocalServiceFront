import React from 'react';
import Camera from './Camera';

export default function Cameras({ selectedEvent }) {
  if (!selectedEvent) {
    return <p>Selecione um evento para ver as câmeras.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <Camera index={1} selectedEvent={selectedEvent} />
      <Camera index={2} selectedEvent={selectedEvent} />
      <Camera index={3} selectedEvent={selectedEvent} />
      <Camera index={4} selectedEvent={selectedEvent} />
    </div>
  );
}
