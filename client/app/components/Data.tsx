'use client';
import React, { useState, useContext, useEffect } from 'react';
import { GithubUserContext, GitlabUserContext } from '../context/userContext';
import styles from "../page.module.css";
import { useSocket } from '../hooks/useSocket';
import { Project, User } from '../util/types';

const Data = () => {
  const { githubUser } = useContext(GithubUserContext);
  const { gitlabUser } = useContext(GitlabUserContext);

  const [projects, setProjects] = useState<Project[]>([]);

  const [data, setData] = useState<boolean>(false);
  const socket = useSocket();

  useEffect(() => {
    if (githubUser?.githubAccessToken !== '' 
      && githubUser?.githubRefreshToken !== ''
      && gitlabUser?.gitLabAccessToken !== ''
      && gitlabUser?.gitLabDomain !== ''  
    ) {
      setData(true);
    }
  }, [githubUser, gitlabUser]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        let res = JSON.parse(event.data);
        switch (res.type) {
          case 'GITLAB_PROJECTS':
            setProjects(res.data);
            break;
          default:
            break;
        }
      }
    }
  }, [socket]);

  console.log("Data -> githubUser", githubUser);
  console.log("Data -> gitlabUser", gitlabUser);

  return (
    <div className={styles.data}>
      {
        !socket ? (
          <div>Connecting...</div>
        ) : (
          <>
            <div className={`${styles.begin} ${!data ? styles.disabled : ''}`} 
              onClick={() => {
                socket.send(JSON.stringify({
                  type: 'GITLAB_INIT',
                  data: {
                    access_token: gitlabUser?.gitLabAccessToken,
                    domain: gitlabUser?.gitLabDomain
                  } as User
                }));
              }}>
                Begin
            </div>
            <div>
              {
                projects.map((project: Project) => {
                  return (
                    <div key={project.id} className={styles.project}>
                      <div>{project.name}</div>
                    </div>
                  )
                })
              }
            </div>
          </>
          )
      }
    </div>
  )
}

export default Data