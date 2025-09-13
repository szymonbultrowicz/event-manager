import { useState, useEffect } from 'react';

export const useCredentials = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [credentialsLoadedFromStorage, setCredentialsLoadedFromStorage] = useState(false);

  // Load credentials from localStorage on component mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('skos-username');
    const savedPassword = localStorage.getItem('skos-password');
    
    if (savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setCredentialsLoadedFromStorage(true);
    }
  }, []);

  // Save credentials to localStorage when they change
  useEffect(() => {
    if (username) {
      localStorage.setItem('skos-username', username);
    } else {
      localStorage.removeItem('skos-username');
    }
  }, [username]);

  useEffect(() => {
    if (password) {
      localStorage.setItem('skos-password', password);
    } else {
      localStorage.removeItem('skos-password');
    }
  }, [password]);

  const resetStorageFlag = () => {
    setCredentialsLoadedFromStorage(false);
  };

  return {
    username,
    password,
    setUsername,
    setPassword,
    credentialsLoadedFromStorage,
    resetStorageFlag,
  };
};
