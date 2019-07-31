import React from 'react';
import styled from 'styled-components';

const Styles = styled.div`
  position: absolute;
  width: 100%;
  pointer-events: none;
  display: flex;
  justify-content: center;
  bottom: 30%;
  span {
    color: white;
    border-radius: 1rem;
    background: rgba(153, 0, 0, 0.9);
    padding: 2rem 4rem;
    font-size: 2em;
  }
`;

export default function ApiError({ message }) {
  return (
    <Styles>
      <span>{message}</span>
    </Styles>
  );
}
