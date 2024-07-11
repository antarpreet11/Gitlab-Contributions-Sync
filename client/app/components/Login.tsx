'use client';
import React from 'react';
import Button from '@mui/material/Button';
import GitHubIcon from '@mui/icons-material/GitHub';

export const LoginButton = () => {
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const githubUrl = process.env.NEXT_PUBLIC_GITHUB_URL;
  const callbackUrl = process.env.NEXT_PUBLIC_GITHUB_CALLBACK_URL || '';

  const handleLogin = () => {
    window.location.href = `${githubUrl}/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}`;
  };

  return (
    <Button variant="outlined" color="secondary" onClick={handleLogin} startIcon={<GitHubIcon />}>Login with GitHub</Button>
  );
};

export default LoginButton;