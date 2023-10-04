import React, { useState, useEffect } from 'react';
import styles from './ProgressBar.module.css';

export const ProgressBar = ({ progress }) => {
  return (
    <div className={styles.progressBarWrapper}>
      <div className={styles.progressBarDiv} style={{ width: `${progress}%` }}>
      {progress > 0 && <span className={styles.progressSpan}>{progress}%</span>}
      </div>
    </div>
  );
};
