'use client';
import React, { useContext, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation';
import { GithubUserContext } from '../context/userContext';
import styles from "../page.module.css";
import Typography from '@mui/material/Typography';
import Login from './Login';

const Github = () => {
  const { githubUser, setGithubUser } = useContext(GithubUserContext);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accessToken = searchParams.get('accessToken');
      const refreshToken = searchParams.get('refreshToken');
      
      if (accessToken && refreshToken) {
        setGithubUser({
          githubAccessToken: accessToken as string,
          githubRefreshToken: refreshToken as string,
        });

        router.push('/');
      }
    }
  }, []);

  return (
    <div className={styles.github}>
        <Typography variant="h4" component="h2">Github</Typography>
        {
          githubUser?.githubAccessToken && githubUser?.githubRefreshToken ? (
            <Typography variant="h6" component="h3">Connected!</Typography>
          ) : (
            <Login />
          )
        }
    </div>
  )
}

export default Github