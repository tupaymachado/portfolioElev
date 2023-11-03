// src/components/Logout.jsx
import React from 'react';
import { auth, signOut } from './FirebaseConfig.jsx';

export function Logout() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}