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

const mapSizePx = '2000';

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
    const [x, y] = parseCoordinates(room.coordinates);
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
  height: 100%;
  overflow: hidden;
  position: absolute;
  canvas {
    z-index: -1000;
    position: absolute;
    width: ${mapSizePx}px;
    transform: rotate(-2.5deg);
  }
`;

const initFocus = { x: mapSizePx / 2, y: mapSizePx / 2 };

function Map({ mapData, currentRoomId = 0, focusRoomId, gameState, isLoading, callbacks, theme }) {
  const canvasRef = useRef();
  const [mapSize, setMapSize] = useState(mapSizePx);
  const currentRoomCoords = useRef();
  const roomCoords = useRef({});
  const roomConnections = useRef({});
  const [focus, setFocus] = useState(initFocus);

  useEffect(() => {
    const focusCoords = roomCoords.current[focusRoomId];
    if (focusCoords) setFocus(focusCoords);
  }, [focusRoomId]);

  // set map size dynamically based on dimensinons of map data coords
  // get max dimension set map size some multiple of it in pix?
  // const [maxX, minX, maxY, minY] = getCoordsMaxMinXY(mapData);
  // console.log(Math.max(maxX - minX, maxY - minY));
  // or draw rooms a set distance apart (#px between each coord) and draw from focus room out, only draw as big as window

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
      const roomRadius = isCurrentRoom || isFocusRoom ? mapSize / 80 : mapSize / 110;
      ctx.arc(x, y, roomRadius, 0, Math.PI * 2, true); // Outer circle
      ctx.shadowBlur = 0;
      ctx.fill();

      // text label
      ctx.font = `bold ${mapSize / 100}px ${theme.font}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isCurrentRoom ? theme.map.currentRoomLabelColor : theme.map.labelColor;
      ctx.shadowBlur = 3;
      ctx.shadowColor = isCurrentRoom ? 'black' : 'white';
      ctx.fillText(roomId, x, y);

      // color label
      if (label) {
        ctx.beginPath();
        ctx.fillStyle = theme.labels[label];
        const labelRadius = mapSize / 200;
        ctx.arc(x - roomRadius * 0.8, y - roomRadius * 0.8, labelRadius, 0, Math.PI * 2, true);
        ctx.fill();
      }
    },
    [mapSize, theme]
  );

  const drawConnection = useCallback(
    (fromX, fromY, toX, toY) => {
      const ctx = canvasRef.current.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(fromX, toX);
      ctx.lineTo(fromY, toY);
      ctx.lineWidth = 4;
      ctx.strokeStyle = theme.map.roomColor;
      ctx.stroke();
    },
    [theme.map.roomColor]
  );

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
    const canvas = canvasRef.current;
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    const [maxX, minX, maxY, minY] = getCoordsMaxMinXY(mapData);

    for (let roomId in mapData) {
      roomId = parseInt(roomId);
      const room = mapData[roomId];

      // coords
      const [rawX, rawY] = parseCoordinates(room.coordinates);
      const [xNorm, yNorm] = [
        (normalizeNum(rawX, maxX, minX) * WIDTH) / dpr,
        // 0, 0 is at bottom, left of grid
        // fix y values (1 - y)
        ((1 - normalizeNum(rawY, maxY, minY)) * HEIGHT) / dpr
      ];
      const scale = 0.9;
      const xScaled = Math.ceil(scaleCenter(xNorm, scale, WIDTH / dpr));
      const yScaled = Math.ceil(scaleCenter(yNorm, scale, HEIGHT / dpr));
      const coords = { x: xScaled + wiggle(4), y: yScaled + wiggle(4) };
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

        if (neighborId !== '?') {
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
        }
      }
    }
  }, [currentRoomId, mapData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const connections = roomConnections.current;
    const coords = roomCoords.current;

    // draw connections
    for (const roomId in connections) {
      const localConnections = connections[roomId];
      const fromCoords = coords[roomId];
      for (const c of localConnections) {
        const toCoords = coords[c];
        drawConnection(fromCoords.x, toCoords.x, fromCoords.y, toCoords.y);
      }
    }

    // draw rooms
    // console.log('drawing rooms');
    for (const roomId in mapData) {
      const { x, y } = coords[roomId];
      const isCurrentRoom = parseInt(roomId) === currentRoomId;
      const isFocusRoom = parseInt(roomId) === focusRoomId;
      const room = mapData[roomId];
      if ('label' in room) {
        drawRoom(x, y, roomId, isCurrentRoom, isFocusRoom, room['label']);
      } else {
        drawRoom(x, y, roomId, isCurrentRoom, isFocusRoom);
      }
    }
  }, [mapData, currentRoomId, theme, focusRoomId, drawRoom, drawConnection]);

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
      <animated.canvas id="grid-canvas" ref={canvasRef} style={moveSpring} />
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
