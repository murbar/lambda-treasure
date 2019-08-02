import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled, { withTheme } from 'styled-components';
import { animated, useSpring } from 'react-spring';
import Navigator from 'components/Navigator';
import Vignette from 'components/Vignette';
import useHotKeys from 'hooks/useHotkeys';

const wiggle = val => {
  const [min, max] = [-val, val];
  return Math.round(Math.random() * (max - min) + min);
};

const dpr = window.devicePixelRatio || 1;

const parseCoordinates = coords => {
  return coords
    .slice(1, coords.length - 1)
    .split(',')
    .map(n => parseInt(n));
};

const getCoordsMaxMinXY = map => {
  let [minX, maxX, minY, maxY] = [1000, 0, 1000, 0];
  for (let roomId in map) {
    const room = map[roomId];
    const [x, y] = parseCoordinates(room.coordinates);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return [maxX, minX, maxY, minY];
};

const getMapMaxDimension = map => {
  const [maxX, minX, maxY, minY] = getCoordsMaxMinXY(map);
  return Math.max(maxX - minX, maxY - minY, 10);
};

const Styles = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  canvas {
    z-index: -1000;
    position: absolute;
    transform: rotate(-2.5deg);
  }
`;

function Map({ mapData, currentRoomId = 0, focusRoomId, gameState, isLoading, callbacks, theme }) {
  // zoom would be large feaature size but smaller
  const mapFeatureSizePx = 80;
  // const mapGridDimension = getMapMaxDimension(mapData) + 1;
  const mapGridDimension = 30;
  const mapSizePx = mapFeatureSizePx * mapGridDimension;
  const initFocus = { x: mapSizePx / 2, y: mapSizePx / 2 };
  const canvasRef = useRef();
  const currentRoomCoords = useRef();
  const roomCoords = useRef({});
  const roomConnections = useRef({});
  const [focus, setFocus] = useState(initFocus);

  useEffect(() => {
    const focusCoords = roomCoords.current[focusRoomId];
    if (focusCoords) setFocus(focusCoords);
  }, [focusRoomId]);

  const drawRoom = useCallback(
    (x, y, roomId, isCurrentRoom, isFocusRoom, label) => {
      const ctx = canvasRef.current.getContext('2d');

      ctx.beginPath();
      // yikes!
      ctx.fillStyle = isCurrentRoom
        ? theme.map.currentRoomColor
        : isFocusRoom
        ? theme.map.focusRoomColor
        : theme.map.roomColor;
      const roomRadius =
        isCurrentRoom || isFocusRoom ? mapFeatureSizePx / 2.5 : mapFeatureSizePx / 3.25;
      ctx.arc(x, y, roomRadius, 0, Math.PI * 2, true);
      ctx.fill();

      // text label
      ctx.font = `bold ${mapFeatureSizePx / 3}px ${theme.font}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isCurrentRoom ? theme.map.currentRoomLabelColor : theme.map.labelColor;
      ctx.shadowBlur = 3;
      ctx.shadowColor = isCurrentRoom ? 'black' : 'white';
      ctx.fillText(roomId, x, y);
      ctx.shadowBlur = 0;

      // color label
      if (label) {
        ctx.beginPath();
        ctx.fillStyle = theme.labels[label];
        const labelRadius = mapFeatureSizePx / 6;
        ctx.arc(x - roomRadius * 0.8, y - roomRadius * 0.8, labelRadius, 0, Math.PI * 2, true);
        ctx.fill();
      }
    },
    [theme]
  );

  const drawUnknownConnections = useCallback(
    (directions, fromX, fromY) => {
      const ctx = canvasRef.current.getContext('2d');
      const lineLength = mapFeatureSizePx / 1.5;
      ctx.lineWidth = Math.floor(mapFeatureSizePx / 20);
      ctx.strokeStyle = theme.map.unknownConnectionColor;
      for (const d of directions) {
        switch (d) {
          case 'n?':
            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(fromX, fromY - lineLength);
            ctx.stroke();
            break;
          case 'e?':
            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(fromX + lineLength, fromY);
            ctx.stroke();
            break;
          case 's?':
            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(fromX, fromY + lineLength);
            ctx.stroke();
            break;
          case 'w?':
            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(fromX - lineLength, fromY);
            ctx.stroke();
            break;
          default:
            break;
        }
      }
    },
    [theme.map.unknownConnectionColor]
  );

  const drawConnection = useCallback(
    (fromX, fromY, toX, toY) => {
      const ctx = canvasRef.current.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(fromX, toX);
      ctx.lineTo(fromY, toY);
      ctx.lineWidth = Math.floor(mapFeatureSizePx / 20);
      ctx.strokeStyle = theme.map.roomColor;
      ctx.stroke();
    },
    [theme.map.roomColor]
  );

  // setup canvas
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

  // get coords & build connections
  useEffect(() => {
    const [maxX, minX, maxY, minY] = getCoordsMaxMinXY(mapData);

    for (let roomId in mapData) {
      if (roomId || roomId === 0) {
        roomId = parseInt(roomId);
        const room = mapData[roomId];

        // coords
        const [rawX, rawY] = parseCoordinates(room.coordinates);
        const constCoordAdjustment = Math.min(minX, minY);
        const adjustedX =
          (rawX - constCoordAdjustment) * mapFeatureSizePx + 0.75 * mapFeatureSizePx;
        // y coord is inverted
        const adjustedY =
          mapSizePx - ((rawY - constCoordAdjustment) * mapFeatureSizePx + 0.75 * mapFeatureSizePx);
        const [x, y] = [adjustedX, adjustedY].map(c => Math.ceil(c)).map(c => c + wiggle(4));
        const coords = { x, y };

        roomCoords.current[roomId] = coords;
        const isCurrentRoom = parseInt(roomId) === currentRoomId;
        if (isCurrentRoom) {
          setFocus(coords);
          currentRoomCoords.current = coords;
        }

        // connections
        for (const neighbor in room.exits) {
          const connections = roomConnections.current;
          const neighborId = room.exits[neighbor];

          // roomConnections.current = {};
          // clear '?'

          if ((neighborId || neighborId === 0) && neighborId !== '?') {
            // store connections under room with smaller id to avoid dupes
            if (neighborId < roomId) {
              const existing = neighborId in connections ? connections[neighborId] : [];
              if (!existing.includes(roomId)) existing.push(roomId);
              connections[neighborId] = existing;
            } else {
              const existing = roomId in connections ? connections[roomId] : [];
              if (!existing.includes(neighborId)) existing.push(neighborId);
              connections[roomId] = existing;
            }
          } else {
            // store unknown neighbor
            const existing = roomId in connections ? connections[roomId] : [];
            const record = `${neighbor}${neighborId}`;
            if (!existing.includes(record)) existing.push(record);
            connections[roomId] = existing;
          }
        }
      }
    }
  }, [currentRoomId, mapData, mapSizePx]);

  // draw features
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const connections = roomConnections.current;
    const coords = roomCoords.current;

    // console.log(connections);

    // draw connections
    for (const roomId in connections) {
      const localConnections = connections[roomId];
      const fromCoords = coords[roomId];
      for (const c of localConnections) {
        const toCoords = coords[c];
        if (typeof c === 'string' && c.includes('?')) {
          drawUnknownConnections(localConnections, fromCoords.x, fromCoords.y);
        } else {
          if (fromCoords && toCoords) {
            drawConnection(fromCoords.x, toCoords.x, fromCoords.y, toCoords.y);
          }
        }
      }
    }

    // draw rooms
    for (const roomId in mapData) {
      const { x, y } = coords[roomId];
      const isCurrentRoom = parseInt(roomId) === currentRoomId;
      const isFocusRoom = parseInt(roomId) === focusRoomId;
      const room = mapData[roomId];
      drawRoom(x, y, roomId, isCurrentRoom, isFocusRoom, room['label']);
    }
  }, [
    mapData,
    currentRoomId,
    theme,
    focusRoomId,
    drawRoom,
    drawConnection,
    drawUnknownConnections
  ]);

  useHotKeys(
    {
      ArrowUp: e => {
        e.preventDefault();
        setFocus(prev => ({ ...prev, y: prev.y - 40 }));
      },
      ArrowRight: e => {
        e.preventDefault();
        setFocus(prev => ({ ...prev, x: prev.x + 40 }));
      },
      ArrowDown: e => {
        e.preventDefault();
        setFocus(prev => ({ ...prev, y: prev.y + 40 }));
      },
      ArrowLeft: e => {
        e.preventDefault();
        setFocus(prev => ({ ...prev, x: prev.x - 40 }));
      }
      // o: e => {
      //   e.preventDefault();
      //   setMapSize(prev => prev * 0.8);
      // },
      // i: e => {
      //   e.preventDefault();
      //   setMapSize(prev => prev * 1.25);
      // }
    },
    false
  );

  const resetFocus = () => {
    setFocus(currentRoomCoords.current ? currentRoomCoords.current : initFocus);
  };

  const preventClickDefault = e => {
    e.preventDefault();
  };

  const handleMouseMove = e => {
    e.preventDefault();
    const { movementX, movementY } = e;
    const mouseButtonIsDown = e.buttons === 1;
    if (mouseButtonIsDown) {
      setFocus(prev => ({ x: prev.x - movementX, y: prev.y - movementY }));
    }
  };

  const handleWheel = e => {
    const { deltaX, deltaY } = e;
    setFocus(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
  };

  const moveSpring = useSpring({
    to: {
      top: `calc(50% - ${focus.y}px)`,
      left: `calc(50% - ${focus.x}px)`
    }
  });

  return (
    <Styles
      focus={focus}
      onMouseMove={handleMouseMove}
      onMouseDown={preventClickDefault}
      onMouseUp={preventClickDefault}
      onWheel={handleWheel}
    >
      <animated.canvas
        id="grid-canvas"
        ref={canvasRef}
        style={{ ...moveSpring, width: `${mapSizePx}px` }}
      />
      <Vignette />
      <Navigator
        gameState={gameState}
        isLoading={isLoading}
        callbacks={{ ...callbacks, resetFocus }}
      />
    </Styles>
  );
}

export default withTheme(Map);
