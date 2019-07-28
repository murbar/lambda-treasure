import React from 'react';
import styled from 'styled-components';
import { ReactComponent as Heart } from 'images/icons/heart.svg';

const StyledDiv = styled.div`
  padding: 2rem 0;
  text-align: center;
  svg {
    height: 1em;
    color: crimson;
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
