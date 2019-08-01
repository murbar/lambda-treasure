import styled from 'styled-components';

export default styled.button`
  font-family: ${p => p.theme.font};
  border: none;
  border-radius: ${p => p.theme.inputBorderRadius};
  font-size: 1.1em;
  padding: 0.25em 0.75em;
  background: ${p => p.theme.colors.primary};
  color: white;
  margin-right: 1rem;
  cursor: pointer;
  ${'' /* text-transform: uppercase; */}
  font-weight: bold;
  &:hover {
    background: white;
    color: ${p => p.theme.colors.primary};
  }
  &:focus {
    outline: none;
  }
  &:last-child {
    margin-right: 0;
  }
`;
