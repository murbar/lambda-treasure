import styled from 'styled-components';

export default styled.input`
  border: none;
  background: ${p => p.theme.colors.darkCream};
  padding: 1rem;
  font-size: 1em;
  border-radius: ${p => p.theme.inputBorderRadius};
  font-family: ${p => p.theme.font};
  &:focus {
    outline: none;
    background: white;
  }
`;
