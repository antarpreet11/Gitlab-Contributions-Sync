'use client';
import React, { useContext, useEffect } from 'react'
import { GitlabUserContext } from '../context/userContext';
import TextField from '@mui/material/TextField';
import styles from "../page.module.css";
import Typography from '@mui/material/Typography';

const Gitlab = () => {
  const { gitlabUser, setGitlabUser } = useContext(GitlabUserContext);

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gitlabUser) {
      setGitlabUser({ ...gitlabUser, gitLabDomain: e.target.value });
    }
  }

  const handleAccessTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gitlabUser) {
      setGitlabUser({ ...gitlabUser, gitLabAccessToken: e.target.value });
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('gitlabDomain') && localStorage.getItem('gitlabAccessToken')) {
        setGitlabUser({
          gitLabAccessToken: localStorage.getItem('gitlabAccessToken') || '',
          gitLabDomain: localStorage.getItem('gitlabDomain') || '',
        });
      }
    }
  }, []);

  return (
    <div className={styles.gitlab}>
        <Typography variant="h4" component="h2">Gitlab</Typography>
        <TextField 
          id="outlined-required" 
          label="Org Gitlab Domain" 
          variant="outlined" 
          value={gitlabUser?.gitLabDomain}
          onChange={handleDomainChange}
        />
        <div className={styles.domain}>*Example: git.xyzuniversity.com</div>     
        <TextField 
          id="outlined-required" 
          label="Personal Access Token" 
          variant="outlined"
          value={gitlabUser?.gitLabAccessToken}
          onChange={handleAccessTokenChange} 
        />
        <div className={styles.docs} onClick={ () => {
          window.open('https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html', '_blank');
        }}>*Documentation on Personal Access Tokens</div>
    </div>
  )
};

export default Gitlab