import { useState, useEffect } from 'react';

export const useCredentials = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Load credentials from localStorage on component mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('skos-username');
    const savedPassword = localStorage.getItem('skos-password');
    
    if (savedUsername) setUsername(savedUsername);
    if (savedPassword) setPassword(savedPassword);
  }, []);

  // Save credentials to localStorage when they change
  useEffect(() => {
    if (username) {
      localStorage.setItem('skos-username', username);
    }
  }, [username]);

  useEffect(() => {
    if (password) {
      localStorage.setItem('skos-password', password);
    }
  }, [password]);

  return {
    username,
    password,
    setUsername,
    setPassword,
  };
};
