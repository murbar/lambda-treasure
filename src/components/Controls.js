import React from 'react';
import styled from 'styled-components';

const Styles = styled.div``;

const Directions = styled.div`
  width: 8rem;
  margin-left: 20rem;
  button {
    display: inline-block;
    width: 4rem;
    height: 3rem;
    border: none;
    background: #ccc;
    margin: 0;
  }
  button:nth-child(1),
  button:nth-child(4) {
    margin: 0 2rem;
  }
`;

export default function Controls() {
  return (
    <Styles>
      <Directions>
        <button>N</button>
        <button>W</button>
        <button>E</button>
        <button>S</button>
      </Directions>
    </Styles>
  );
}
