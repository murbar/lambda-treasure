// fullscreen modal?

import React, { useState } from 'react';
import styled from 'styled-components';

const Styles = styled.div``;

const FormField = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
  label {
    padding: 0 1rem;
    text-transform: uppercase;
    font-weight: bold;
  }
`;

const Input = styled.input`
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

const Button = styled.button`
  font-family: ${p => p.theme.font};
  border: none;
  border-radius: ${p => p.theme.inputBorderRadius};
  font-size: 1.25em;
  padding: 0.25rem 1.5rem;
  background: ${p => p.theme.colors.primary};
  color: white;
  &:hover {
    background: white;
    color: ${p => p.theme.colors.primary};
  }
  &:focus {
    outline: none;
  }
`;

export default function Settings({ gameState, callbacks }) {
  const [key, setKey] = useState(gameState.apiKey);

  const save = () => {
    callbacks.setApiKey(key);
  };

  const handleChange = e => {
    setKey(e.target.value);
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') save();
  };

  return (
    <Styles>
      <h2>Settings</h2>
      <FormField>
        <label htmlFor="api-key">API Key</label>
        <Input
          type="text"
          id="api-key"
          placeholder="Token xxxxxxxxxxxxxxxxxxx"
          value={key || ''}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
        />
      </FormField>
      <Button onClick={save}>Save</Button>
      <Button onClick={callbacks.resetGame}>Reset Game</Button>
    </Styles>
  );
}
