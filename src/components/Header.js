import React from 'react';
import styled from 'styled-components';

const Styles = styled.header`
  position: absolute;
  z-index: 1500;
  h1 {
    margin: 2rem;
    line-height: 1;
    font-size: 1.6em;
    text-shadow: 0 0 1rem white, 0 0 1px white;
    color: #222;
    text-align: center;
    transform-origin: top left;
    transform: rotate(-2.5deg) scale(0.5);
    transition: all 0.25s;
    &:hover {
      transform: rotate(-2.5deg) scale(1);
    }
  }
`;

export default function Header() {
  return (
    <Styles>
      <h1>
        Lambda
        <br />
        Treasure
        <br />
        Hunt
      </h1>
    </Styles>
  );
}
