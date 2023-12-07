import React from 'react';
import styles from './Logout.module.css';
import { auth, signOut } from './firebaseConfig.jsx';

export function Logout() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.logoutButtonContainer}>
      <button className={styles.logoutButton} onClick={handleLogout}>Logout</button>
    </div>
  );
}