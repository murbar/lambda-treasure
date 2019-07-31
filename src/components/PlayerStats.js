import React from 'react';
import styled from 'styled-components';

const Styles = styled.div``;

const Name = styled.div`
  text-align: right;
  font-size: 1.5em;
  font-weight: bold;
`;

const Stats = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

const Stat = styled.div`
  padding: 0.5rem 0.75rem 0.35rem;
  border-radius: 0.5rem;
  line-height: 1;
  margin-right: 1rem;
  background: #222;
  box-shadow: 0 0 1em white;
  color: white;
  text-transform: uppercase;

  span {
    font-family: ${p => p.theme.headingFont};
    font-size: 1.2em;
    margin-left: 0.5rem;
  }
  &.gold {
    background: ${p => p.theme.colors.gold};
    box-shadow: 0 0 1em ${p => p.theme.colors.gold};
    color: black;
  }
  &:last-child {
    margin-right: 0;
  }
`;

export default function PlayerStats({ gameState }) {
  const { gold, speed, encumbrance, strength, name } = gameState.serverData;
  return (
    <Styles>
      <Name>{name}</Name>
      <Stats>
        <Stat className="gold" title={`Gold ${gold}`}>
          G <span>{gold}</span>
        </Stat>
        <Stat className="strength" title={`Strength ${strength}`}>
          St <span>{strength}</span>
        </Stat>
        <Stat className="speed" title={`Speed ${speed}`}>
          Sp <span>{speed}</span>
        </Stat>
        <Stat className="encumbrance" title={`Encumbrance ${encumbrance}`}>
          En <span>{encumbrance}</span>
        </Stat>
      </Stats>
    </Styles>
  );
}
