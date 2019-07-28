import React from 'react';
import styled from 'styled-components';

const Styles = styled.header`
  text-align: center;
  h1 {
    margin: 1rem 0;
    line-height: 1;
    font-size: 1.4em;
  }
`;

export default function Header() {
  return (
    <Styles>
      <h1>Lambda Treasure Hunt</h1>
    </Styles>
  );
}
