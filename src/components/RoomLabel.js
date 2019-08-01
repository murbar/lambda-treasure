import React, { useState } from 'react';
import styled from 'styled-components';

const labelsMap = {
  red: { color: '#e74c3c', name: 'Red' },
  orange: { color: '#f39c12', name: 'Orange' },
  yellow: { color: '#f1c40f', name: 'Yellow' },
  green: { color: '#2ecc71', name: 'Green' },
  blue: { color: '#3498db', name: 'Blue' },
  purple: { color: '#9b59b6', name: 'Purple' }
};

const Styles = styled.div`
  position: relative;
  display: inline-block;
  vertical-align: baseline;
  margin-right: 1rem;
`;

const Label = styled.div`
  position: relative;
  width: 2.6rem;
  height: 2.6rem;
  background: ${p => (p.color === 'none' ? 'transparent' : p.color)};
  border-radius: 50%;
  border: 0.6rem solid ${p => (p.color === 'none' ? '#222' : p.color)};
  cursor: pointer;
  &:hover {
    background: transparent;
  }
`;

const Picker = styled.div`
  position: absolute;
  top: 0;
  left: -3rem;
  border-radius: 0.5rem;
  ${Label} {
    margin-bottom: 0.5rem;
    &:last-child {
      margin-bottom: 0;
    }
    &:hover {
      background: white;
    }
  }
`;

export default function RoomLabel({ label = null, setLabel }) {
  const [showPicker, setShowPicker] = useState(false);
  const [labelChoice, setLabelChoice] = useState(label);

  const set = label => {
    setLabel(label);
    setShowPicker(false);
    setLabelChoice(label);
  };

  return (
    <Styles>
      {label ? (
        <Label
          color={labelsMap[labelChoice].color}
          title={`${labelsMap[labelChoice].name} label`}
          onClick={() => setShowPicker(prev => !prev)}
        />
      ) : (
        <Label
          color="none"
          title="Set a room label?"
          onClick={() => setShowPicker(prev => !prev)}
        />
      )}
      {showPicker && (
        <Picker>
          <Label
            color={labelsMap['red'].color}
            title={`${labelsMap['red'].name} label`}
            onClick={() => set('red')}
          />
          <Label
            color={labelsMap['orange'].color}
            title={`${labelsMap['orange'].name} label`}
            onClick={() => set('orange')}
          />
          <Label
            color={labelsMap['yellow'].color}
            title={`${labelsMap['yellow'].name} label`}
            onClick={() => set('yellow')}
          />
          <Label
            color={labelsMap['green'].color}
            title={`${labelsMap['green'].name} label`}
            onClick={() => set('green')}
          />
          <Label
            color={labelsMap['blue'].color}
            title={`${labelsMap['blue'].name} label`}
            onClick={() => set('blue')}
          />
          <Label
            color={labelsMap['purple'].color}
            title={`${labelsMap['purple'].name} label`}
            onClick={() => set('purple')}
          />
          <Label color="none" title="No label" onClick={() => set(null)} />
        </Picker>
      )}
    </Styles>
  );
}
