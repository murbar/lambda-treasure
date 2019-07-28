import React from 'react';
import styled from 'styled-components';

const Styles = styled.header`
  text-align: center;
  h1 {
    margin: 2rem 0;
    line-height: 1;
  }
`;

export default function Header() {
  return (
    <Styles>
      <h1>Lambda Treasure Hunt</h1>
    </Styles>
  );
}
