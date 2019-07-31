import React from 'react';
import styled from 'styled-components';
import { ReactComponent as LoadingAnimation } from 'images/loading.svg';

const Styles = styled.div`
  position: absolute;
  left: calc(50% - 8rem);
  bottom: 40%;
  color: black;
  pointer-events: none;
  width: 100%;
  svg {
    width: 16rem;
  }
`;

export default function Loading({ isLoading }) {
  return isLoading ? (
    <Styles>
      <LoadingAnimation />
    </Styles>
  ) : null;
}
