'use client';
import React, { useState, useContext, useEffect } from 'react';
import { GithubUserContext, GitlabUserContext } from '../context/userContext';
import styles from "../page.module.css";

const Data = () => {
  const { githubUser } = useContext(GithubUserContext);
  const { gitlabUser } = useContext(GitlabUserContext);

  const [data, setData] = useState<boolean>(false);

  useEffect(() => {
    if (githubUser?.githubAccessToken !== '' 
      && githubUser?.githubRefreshToken !== ''
      && gitlabUser?.gitLabAccessToken !== ''
      && gitlabUser?.gitLabDomain !== ''  
    ) {
      setData(true);
    }
  }, [githubUser, gitlabUser]);

  console.log("Data -> githubUser", githubUser);
  console.log("Data -> gitlabUser", gitlabUser);

  return (
    <div className={styles.data}>
       <div className={`${styles.begin} ${!data ? styles.disabled : ''}`}>Begin</div>
    </div>
  )
}

export default Data