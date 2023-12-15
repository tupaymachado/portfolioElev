import React from 'react';
import styles from './Logout.module.css';
import { auth, signOut } from './firebaseConfig.jsx';

export function Logout() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      document.location.reload();      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button className={styles.logoutButton} onClick={handleLogout}>Sair</button>
  );
}