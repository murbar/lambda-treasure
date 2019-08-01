import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import Button from 'components/common/Button';
import { ReactComponent as CompassImage } from 'images/compass-small.svg';
import useQueue from 'hooks/useQueue';
import useKeyDown from 'hooks/useKeyDown';

const Styles = styled.div``;

const DirectionalControls = styled.div`
  width: 16rem;
  height: 16rem;
  transform: rotate(-2.5deg);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: ${p => p.theme.hudShadow};
  position: absolute;
  right: 10%;
  bottom: 15%;
  z-index: 2000;
  border-radius: 50%;
  svg {
    width: 130%;
    position: absolute;
    top: -15%;
    left: -15%;
    z-index: 0;
    opacity: 0.7;
  }
  .buttons {
    box-sizing: content-box;
    position: absolute;
    top: 0;
    left: 0;
    padding: 2rem;
    z-index: 1;
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
    padding: 0;
    font-family: ${p => p.theme.font};
    text-shadow: 0 0 0.5rem white;
    font-size: 2.5em;
    line-height: 1;
    font-weight: bold;
    cursor: pointer;

    &:hover {
      color: ${p => p.theme.colors.primary};
    }
    &[disabled] {
      cursor: default;
      color: #eee;
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

const ControlQueue = styled.div`
  position: absolute;
  bottom: calc(20% + 16rem);
  right: calc(10% - 1rem);
  text-align: right;
  max-width: 45rem;
  padding: 1rem;
  border-radius: 1rem;
  background: ${p => p.theme.queue.bgColor};
  h2 {
    margin-bottom: 1rem;
  }
  button {
    font-size: 1em;
  }
`;

const QueueItems = styled.div`
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap-reverse;
  margin-right: -2rem;
  span.step {
    position: absolute;
    color: black;
    top: -0.5em;
    right: -0.5em;
    background: ${p => p.theme.colors.darkCream};
    line-height: 1;
    padding: 0 0.25em;
    border-radius: 50%;
    width: 1em;
  }
  > span {
    display: inline-block;
    width: 1.5em;
    color: white;
    background: black;
    text-align: center;
    font-size: 1.25em;
    border-radius: 0.25em;
    margin: 0 3rem 1.25rem 0;
    position: relative;
    text-transform: uppercase;
    font-weight: bold;
    &:after {
      content: '→';
      display: block;
      position: absolute;
      color: black;
      font-size: 1.25em;
      top: 0;
      left: -2.75rem;
    }
  }
  > span:last-child {
    &:after {
      content: '';
    }
  }
  > span:first-child {
    ${'' /* margin-right: 0; */}
  }
`;

export default function Navigator({ gameState, callbacks, isLoading }) {
  const { exits } = gameState.serverData;
  const { move } = callbacks;
  const moveQueue = useQueue(['n', 'n', 'w', 'e', 'n', 'n', 'w', 'e', 'n', 'n', 'w', 'e']);
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
      {exits.length > 0 && (
        <DirectionalControls>
          <CompassImage />
          <div className="buttons">
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
          </div>
        </DirectionalControls>
      )}

      {moveQueue.count > 0 && (
        <ControlQueue>
          {/* <OverlayBox> */}
          <h2>
            {moveQueue.count} moves in queue {queueRunning && '(Running)'}
          </h2>
          <QueueItems>
            {moveQueue.items.map((m, key) => (
              <>
                <span key={key}>
                  {m} <span className="step">{moveQueue.items.length - key}</span>
                </span>
              </>
            ))}
          </QueueItems>
          <Button
            onClick={() => setQueueRunning(true)}
            disabled={gameState.serverData.cooldown > 0}
          >
            Go
          </Button>
          <Button
            onClick={() => {
              clearTimeout(queueTimer.current);
              setQueueRunning(false);
            }}
          >
            Pause
          </Button>
          <Button onClick={() => moveQueue.dequeue()}>Pop</Button>
          <Button onClick={() => moveQueue.flush()}>Clear</Button>
          {/* </OverlayBox> */}
        </ControlQueue>
      )}
    </Styles>
  );
}
