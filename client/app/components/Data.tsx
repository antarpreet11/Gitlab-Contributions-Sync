'use client';
import React, { useState, useContext, useEffect } from 'react';
import { GithubUserContext, GitlabUserContext } from '../context/userContext';
import styles from "../page.module.css";
import { useSocket } from '../hooks/useSocket';
import { Project, User } from '../util/types';
import Repositories from './Repositories';
import Buttons from './Buttons';

const Data = () => {
  const { githubUser } = useContext(GithubUserContext);
  const { gitlabUser } = useContext(GitlabUserContext);

  const [projects, setProjects] = useState<Project[]>([]);
  const [commits, setCommits] = useState<number | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<Project[]>([]);
  const [displayMessage, setDisplayMessage] = useState<string>('');

  const toggleProjectSelection = (project: Project) => {
    setSelectedProjects(prev => 
      prev.find(p => p.id === project.id) 
        ? prev.filter(p => p.id !== project.id) 
        : [...prev, project]
    );
  };

  const [data, setData] = useState<boolean>(false);
  const socket = useSocket();

  const githubInit = () => {
    if (socket && githubUser) {
      socket.send(JSON.stringify({ type: 'GITHUB_INIT', data: githubUser }));
    }
  };

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
            localStorage.setItem('gitlabDomain', gitlabUser?.gitLabDomain || '');
            localStorage.setItem('gitlabAccessToken', gitlabUser?.gitLabAccessToken || '');
            setProjects(res.data);
            break;
          case 'GITLAB_COMMITS':
            // console.log('Commits: ' + res.data.length);
            let c = 0;
            for (let i = 0; i < res.data.length; i++) {
              c += res.data[i].commits.length;
            }
            setCommits(c);
            if (c > 0) {

              githubInit();
            }
            break;
          case 'GITHUB_INIT':
            console.log(res);
            break;
          case 'UPDATE':
            console.log(res);
            setDisplayMessage(prev => prev + '\n' + res.data);
            break;
          case 'ERROR':
            console.log('Error: ' + res.data);
            setDisplayMessage(res.data);
            break;  
          default:
            break;
        }
      }
    }
  }, [socket]);

  useEffect(() => {
    if (data) {
      if (commits !== null) {
        if (commits > 0) {
          setDisplayMessage(`Commits found: ${commits}`);
        } else {
          setDisplayMessage('No commits found');
        }
      } else {
        setDisplayMessage('');
      }
    } else {
      setDisplayMessage('Enter Gitlab credentials & Sign in with Github to begin');
    }
  }, [commits, data]);

  // console.log("Data -> githubUser", githubUser);
  // console.log("Data -> gitlabUser", gitlabUser);
  // console.log(selectedProjects);

  return (
    <div className={styles.data}>
      {
        !socket ? (
          <div>Connecting...</div>
        ) : (
          <>
            <Buttons socket={socket} gitlabUser={gitlabUser} data={data} projects={projects} selectedProjects={selectedProjects}></Buttons>
            <Repositories projects={projects} selectedProjects={selectedProjects} toggleProjectSelection={toggleProjectSelection}></Repositories>
            {
              displayMessage && <div>{displayMessage}</div>
            }
          </>
          )
      }
    </div>
  )
}

export default Data