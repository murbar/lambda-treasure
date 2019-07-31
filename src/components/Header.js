import React from 'react';
import styled from 'styled-components';

const Styles = styled.header`
  position: absolute;
  h1 {
    margin: 2rem;
    line-height: 1;
    font-size: 1.4em;
    text-shadow: 0 0 1rem black, 0 0 1px black, 0 0 1rem white;
    color: white;
  }
`;

export default function Header() {
  return (
    <Styles>
      <h1>
        Lambda <br />
        Treasure <br />
        Hunt
      </h1>
    </Styles>
  );
}
