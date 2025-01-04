import React from 'react';
import '../styling/orb.css';

const Orb = ({ size = '100px', color = '#4F86F7', glow = true }) => {
  return (
    <div
      className={`orb ${glow ? 'orb-glow' : ''}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
    />
  );
};

export default Orb;