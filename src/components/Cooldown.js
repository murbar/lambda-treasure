import React from 'react';
import styled from 'styled-components';
import { ReactComponent as ClockSvg } from 'images/clock.svg';

const Styles = styled.div`
  position: absolute;
  bottom: 35%;
  left: 0;
  height: 1em;

  ${'' /* align-items: center; */}
  text-align: center;
  ${'' /* text-align: center; */}
  ${'' /* justify-content: center; */}
  color: ${p => p.theme.colors.primary};
  pointer-events: none;
  z-index: 1000;
  width: 100%;
  font-size: 8rem;
  > div {
  padding: 1rem 3rem;
  border-radius: 3rem;
    box-shadow: 0 0 3rem ${p => p.theme.hud.blendBgColor};
    background: ${p => p.theme.hud.blendBgColor};
    display: inline-flex;
    width: auto;
  }
  span {
  font-family: ${p => p.theme.headingFont};
    font-size: 0.7em;
    margin-left: 0.25em;
    text-shadow: 0 0 1px white;
  }
  svg {
    width: 1em;
    filter: drop-shadow(0 0 1px white);
  }
`;

export default function Cooldown({ secs }) {
  return secs > 0 ? (
    <Styles>
      <div>
        <ClockSvg /> {secs > 1 ? <span>{secs}</span> : null}
      </div>
    </Styles>
  ) : null;
}
