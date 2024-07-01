import React, { useRef, useState, useEffect } from 'react';

export default function FogOfWarSlave({ imageSrc, coord, self, pcName, pcs, newPCPosition }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const canvasPCsRef = useRef(null);

  useEffect(() => {
    const img = imgRef.current;

    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const canvasPCs = canvasPCsRef.current;
      canvasPCs.width = img.width;
      canvasPCs.height = img.height;
    };
  }, []);

  // clears the fog of war
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / coord.vw
    const scaleY = canvas.height / coord.vh
    const x = coord.x * scaleX
    const y = coord.y * scaleY

    // TODO this 50 is a magic number, move it somewhere
    ctx.lineWidth = 50 * scaleX
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(0, 0, 0, 1)';

    if (coord.action === 'start') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else if (coord.action === 'end') {
      ctx.beginPath()
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  }, [coord])

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

  // adds a new PC marker for this player
  const handleClick = (event) => {
    newPCPosition({ x: event.clientX, y: event.clientY, name: pcName })
  };

  return (
    <div className="image-container">
      <img ref={imgRef} src={imageSrc} />
      <canvas
        ref={canvasRef}
        className="fog-canvas"
      />
      <canvas
        ref={canvasPCsRef}
        onClick={handleClick}
        className="pcs-canvas"
      />
    </div>
  );
}
