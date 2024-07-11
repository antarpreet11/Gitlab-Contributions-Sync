'use client';
import React from 'react'
import styles from "../page.module.css";
import Typography from '@mui/material/Typography';
import Login from './Login';

const Github = () => {
  return (
    <div className={styles.github}>
        <Typography variant="h4" component="h2">Github</Typography>
        <Login />
    </div>
  )
}

export default Github