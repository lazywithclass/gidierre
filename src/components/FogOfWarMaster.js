import React, { useRef, useState, useEffect } from 'react';

export default function FogOfWarMaster({ imageSrc, onChange, pcs }) {

  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const canvasPCsRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const canvasPCs = canvasPCsRef.current;
      canvasPCs.width = img.width;
      canvasPCs.height = img.height;
    };
  }, []);

  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 50;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(0, 0, 0, 1)';

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    // TODO to save bandwidth only send vw and vh at the start or when they change
    onChange({ x, y, vw: canvas.width, vh: canvas.height })
  };

  const handleMouseDown = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    canvas.addEventListener('mousemove', handleMouseMove);
    onChange({ action: 'start', x, y, vw: canvas.width, vh: canvas.height })
  };

  const handleMouseUp = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    canvas.removeEventListener('mousemove', handleMouseMove);
    const ctx = canvas.getContext('2d');
    ctx.beginPath()
    onChange({action: 'end'})
  };

  useEffect(() => {
    updatePCsPositions(pcs)
  }, [pcs])

  function updatePCsPositions(pcs) {
    const canvas = canvasPCsRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pcs.forEach(pc => {
      ctx.beginPath();
      ctx.arc(pc.x, pc.y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "blue";
      ctx.stroke();
      ctx.font = "14px";
      ctx.fillText(pc.name, pc.x+3, pc.y-3);
    })
  }

  return (
    <div className="image-container">
      <img ref={imgRef} src={imageSrc} />
      <canvas
        ref={canvasPCsRef}
        className="pcs-canvas"
      />
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseUp}
        className="fog-canvas"
      />
    </div>
  );
};
