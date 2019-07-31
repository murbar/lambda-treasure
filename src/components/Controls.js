import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Button from 'components/common/Button';
import compass from 'images/compass-small.svg';
import useQueue from 'hooks/useQueue';
import useKeyDown from 'hooks/useKeyDown';

const Styles = styled.div``;

const Directions = styled.div`
  width: 12rem;
  transform: rotate(6deg);
  background: url(${compass}) center / 100% no-repeat;
  position: absolute;
  right: 0;
  button {
    display: inline-block;
    width: 4rem;
    height: 4rem;
    border: none;
    background: transparent;
    margin: 0;
    font-family: ${p => p.theme.font};
    font-size: 1.5em;
    font-weight: bold;
    cursor: pointer;
    &:hover {
      color: ${p => p.theme.colors.primary};
    }
    &[disabled] {
      cursor: default;
      color: #aaa;
    }
  }
  button:nth-child(1),
  button:nth-child(4) {
    margin: 0 4rem;
  }
  button:nth-child(2) {
    margin-right: 4rem;
  }
`;

export default function Controls({ gameState, callbacks, isLoading }) {
  const { exits, items } = gameState.serverData.room;
  const { inventory } = gameState.serverData.player;
  const { move, takeItem, dropItem, checkStatus, sellItem } = callbacks;
  const moveQueue = useQueue();
  const [queueRunning, setQueueRunning] = useState(false);
  const queueTimer = useRef(null);
  const isShiftPressed = useKeyDown('Shift');

  const handleDirectionControlClick = e => {
    const isShiftClick = e.shiftKey;
    const { dir } = e.target.dataset;
    if (isShiftClick) {
      moveQueue.enqueue(dir);
    } else {
      move(dir);
    }
  };

  // run down moveQueue
  useEffect(() => {
    const cd = gameState.serverData.cooldown;

    const nextInQueue = () => {
      if (queueTimer.current === null) {
        queueTimer.current = setTimeout(() => {
          move(moveQueue.dequeue());
          queueTimer.current = null;
        }, cd + 100);
      }
    };

    if (queueRunning && !moveQueue.count) {
      setQueueRunning(false);
    } else if (queueRunning && cd === 0 && !isLoading) {
      nextInQueue();
    }
  }, [gameState.serverData.cooldown, isLoading, move, moveQueue, queueRunning]);

  const disableDirectionButton = direction => {
    if (queueRunning) {
      return true;
    } else if (isShiftPressed) {
      return false;
    } else {
      return !exits.includes(direction);
    }
  };

  return (
    <Styles>
      {exits && (
        <Directions>
          <button
            data-dir="n"
            disabled={disableDirectionButton('n')}
            onClick={handleDirectionControlClick}
          >
            N
          </button>
          <button
            data-dir="w"
            disabled={disableDirectionButton('w')}
            onClick={handleDirectionControlClick}
          >
            W
          </button>
          <button
            data-dir="e"
            disabled={disableDirectionButton('e')}
            onClick={handleDirectionControlClick}
          >
            E
          </button>
          <button
            data-dir="s"
            disabled={disableDirectionButton('s')}
            onClick={handleDirectionControlClick}
          >
            S
          </button>
        </Directions>
      )}
      {items && (
        <div>
          <h2>Items in room</h2>
          {items.map((item, key) => (
            <Button key={key} onClick={() => takeItem(item)}>
              Pick up {item}
            </Button>
          ))}
        </div>
      )}
      {inventory && (
        <div>
          <h2>Inventory ({inventory.length})</h2>
          {inventory.map((item, key) => (
            <div key={key}>
              {item}
              <Button onClick={() => dropItem(item)}>Drop</Button>
              {gameState.serverData.room.title === 'Shop' && (
                <Button onClick={() => sellItem(item)}>Sell</Button>
              )}
            </div>
          ))}
        </div>
      )}
      <Button onClick={checkStatus}>Get status</Button>
      {moveQueue.count > 0 && (
        <div>
          <h2>
            Moves queued {queueRunning && '(Running)'} {moveQueue.count}
          </h2>
          {moveQueue.items.map((m, key) => (
            <span key={key}>{m}</span>
          ))}
          <Button onClick={() => setQueueRunning(true)}>Start</Button>
          <Button
            onClick={() => {
              clearTimeout(queueTimer.current);
              setQueueRunning(false);
            }}
          >
            Stop
          </Button>
          <Button onClick={() => moveQueue.dequeue()}>Remove Last</Button>
          <Button onClick={() => moveQueue.flush()}>Clear</Button>
        </div>
      )}
    </Styles>
  );
}
