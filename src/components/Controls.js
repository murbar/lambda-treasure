import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Button from 'components/common/Button';
import compass from 'images/compass-small.svg';
import useQueue from 'hooks/useQueue';
import useKeyDown from 'hooks/useKeyDown';

const Styles = styled.div``;

const DirectionalControls = styled.div`
  width: 12rem;
  box-sizing: content-box; 
  transform: rotate(-2.5deg);
  background: rgba(255,255,255,0.9) url(${compass}) center / 80% no-repeat;
  box-shadow: ${p => p.theme.hudShadow};
  position: absolute;
  right: 2rem;
  bottom: 10%;
  z-index: 1000;
  padding: 2rem;
  border-radius: 50%;
  }
  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 4rem;
    height: 4rem;
    border: none;
    background: transparent;
    margin: 0;
    font-family: ${p => p.theme.headingFont};
    font-size: 1.75em;
    font-weight: bold;
    cursor: pointer;
    &:hover {
      color: ${p => p.theme.colors.primary};
    }
    &[disabled] {
      cursor: default;
      color: #aaa;
    }
    &:focus {
      outline: none;
    }
  }
  button:nth-child(1),
  button:nth-child(5) {
    margin: 0 4rem;
  }
  button:nth-child(3) {

  }
`;

export default function Controls({ gameState, callbacks, isLoading }) {
  const { exits } = gameState.serverData.room;
  const { move } = callbacks;
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
        <DirectionalControls>
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
          <button onClick={callbacks.resetFocus}>·</button>
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
        </DirectionalControls>
      )}
      {moveQueue.count > 0 && (
        <div>
          <h2>
            Moves queued {queueRunning && '(Running)'} {moveQueue.count}
          </h2>
          {moveQueue.items.map((m, key) => (
            <span key={key}>{m}</span>
          ))}
          <Button
            onClick={() => setQueueRunning(true)}
            disabled={gameState.serverData.cooldown > 0}
          >
            Start
          </Button>
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
