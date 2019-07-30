import React, { useRef, useEffect } from 'react';
import styled, { withTheme } from 'styled-components';

const dpr = window.devicePixelRatio || 1;

const roomColor = '#f6d6ad';

const parseCoordinates = coords => {
  return coords
    .slice(1, coords.length - 1)
    .split(',')
    .map(n => parseInt(n));
};

const normalizeNum = (n, nMax, nMin) => {
  return (n - nMin) / (nMax - nMin);
};

const getCoordsMaxMinXY = map => {
  let [minX, maxX, minY, maxY] = [1000, 0, 1000, 0];
  for (let roomId in map) {
    const room = map[roomId];
    const [x, y] = parseCoordinates(room.coords);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return [maxX, minX, maxY, minY];
};

const scaleCenter = (val, scale, range) => {
  const padding = ((1 - scale) / 2) * range;
  return val * scale + padding;
};

const Styles = styled.div`
  width: 100%;
  overflow: scroll;
  height: 40rem;
  canvas {
    width: 1600px;
  }
`;

function Map({ mapData, currentRoomId, highlightRoomId, theme }) {
  const canvasRef = useRef();

  const drawRoom = (x, y, roomId, isCurrentRoom, isHighlightRoom) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    // yikes!
    ctx.fillStyle = isCurrentRoom ? '#BE1C29' : isHighlightRoom ? 'white' : roomColor;
    const radius = isCurrentRoom ? 18 : 15;
    ctx.arc(x, y, radius, 0, Math.PI * 2, true); // Outer circle
    ctx.shadowBlur = 0;
    ctx.fill();
    // label
    ctx.font = "bold 15px 'Alegreya Sans'";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isCurrentRoom ? 'white' : '#5D3411';
    ctx.shadowBlur = 3;
    ctx.shadowColor = isCurrentRoom ? 'black' : 'white';
    ctx.fillText(roomId, x, y);
  };

  const drawConnection = (fromX, fromY, toX, toY) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(fromX, toX);
    ctx.lineTo(fromY, toY);
    ctx.lineWidth = 2;
    ctx.strokeStyle = roomColor;
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = canvas.width;
    ctx.scale(dpr, dpr);

    // ctx.fillStyle = 'white';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const [maxX, minX, maxY, minY] = getCoordsMaxMinXY(mapData);

    const roomConnections = {};
    const roomCoords = {};

    // get coords & build connections
    for (let roomId in mapData) {
      roomId = parseInt(roomId);
      const room = mapData[roomId];

      // coords
      const [rawX, rawY] = parseCoordinates(room.coords);
      const [xNorm, yNorm] = [
        (normalizeNum(rawX, maxX, minX) * WIDTH) / dpr,
        // 0, 0 is at bottom, left of grid
        // fix y values (1 - y)
        ((1 - normalizeNum(rawY, maxY, minY)) * HEIGHT) / dpr
      ];
      const scale = 0.9;
      const xScaled = Math.ceil(scaleCenter(xNorm, scale, WIDTH));
      const yScaled = Math.ceil(scaleCenter(yNorm, scale, HEIGHT));
      roomCoords[roomId] = { x: xScaled, y: yScaled };

      // connections
      for (const neighbor in room.exits) {
        const neighborId = room.exits[neighbor];
        // store connections under room with smaller id to avoid dupes
        if (neighborId < roomId) {
          const existing = neighborId in roomConnections ? roomConnections[neighborId] : [];
          if (!existing.includes(roomId)) existing.push(roomId);
          roomConnections[neighborId] = existing;
        } else {
          const existing = roomId in roomConnections ? roomConnections[roomId] : [];
          if (!existing.includes(neighborId)) existing.push(neighborId);
          roomConnections[roomId] = existing;
        }
      }
    }

    // draw connections
    for (const roomId in roomConnections) {
      const connections = roomConnections[roomId];
      const fromCoords = roomCoords[roomId];
      for (const c of connections) {
        const toCoords = roomCoords[c];
        drawConnection(fromCoords.x, toCoords.x, fromCoords.y, toCoords.y);
      }
    }

    // draw rooms
    for (const roomId in mapData) {
      const { x, y } = roomCoords[roomId];
      const isCurrentRoom = parseInt(roomId) === currentRoomId;
      const isHighlightRoom = parseInt(roomId) === highlightRoomId;

      drawRoom(x, y, roomId, isCurrentRoom, isHighlightRoom);
    }
  }, [mapData, currentRoomId, theme]);

  return (
    <Styles>
      <canvas id="grid-canvas" ref={canvasRef} />
    </Styles>
  );
}

export default withTheme(Map);
