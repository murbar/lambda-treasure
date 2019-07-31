import React from 'react';
import styled from 'styled-components';
import { ReactComponent as Heart } from 'images/icons/heart.svg';

const StyledDiv = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  text-align: right;
  font-size: 0.9em;
  line-height: 1.2;
  text-shadow: 0 0 1px white, 0 0 1rem white;
  font-weight: bold;
  svg {
    height: 1em;
    color: ${p => p.theme.colors.primary};
    margin: 0 -0.25rem;
  }
`;

const Footer = () => {
  return (
    <StyledDiv>
      Made with{' '}
      <span role="img" aria-label="love">
        <Heart />
      </span>{' '}
      by{' '}
      <a href="https://joelb.dev" title="Joel Bartlett's portfolio">
        Joel Bartlett
      </a>
      <br />{' '}
      <a href="https://github.com/murbar/lambda-treasure" title="See the code on GitHub">
        Have a look at the code
      </a>
    </StyledDiv>
  );
};

export default Footer;
