import React, { useState, useEffect } from 'react';

export const ProgressBar = ({ progress }) => {
  return (
    <div style={{ width: '100%', backgroundColor: '#ccc', borderRadius: '10px' }}>
      <div style={{
        height: '20px',
        width: `${progress}%`,
        backgroundColor: '#4caf50',
        borderRadius: '10px',
        textAlign: 'right'
      }}>
        {progress > 0 && <span style={{ color: 'white', paddingRight: '10px' }}>{progress}%</span>}
      </div>
    </div>
  );
};
