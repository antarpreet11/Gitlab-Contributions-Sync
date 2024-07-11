import React from 'react'
import { User, GitlabUser, Project } from '../util/types';
import styles from "../page.module.css";

interface ButtonsProps {
    socket: WebSocket;
    data: boolean;
    gitlabUser: GitlabUser | null;
    projects: Project[];
    selectedProjects: Project[];
}

const beginHandler = (socket: WebSocket, gitlabUser: GitlabUser | null) => {
    socket.send(JSON.stringify({
        type: 'GITLAB_INIT',
        data: {
            access_token: gitlabUser?.gitLabAccessToken,
            domain: gitlabUser?.gitLabDomain
        } as User
    }));
};

const getCommitsHandler = (socket: WebSocket, selectedProjects: Project[]) => {
    socket.send(JSON.stringify({
        type: 'GITLAB_GET_COMMITS',
        data: {
            projects: selectedProjects,
        } 
    }));
};

const Buttons = ({socket, data, gitlabUser, projects, selectedProjects}: ButtonsProps) => {
    return (
        <>  {
                projects.length > 0 ? (
                    <div className={`${styles.begin}`}
                        onClick={() => getCommitsHandler(socket, selectedProjects)}>
                        Sync
                    </div>
                ) :
                (
                    <div className={`${styles.begin} ${!data ? styles.disabled : ''}`} 
                        onClick={() => beginHandler(socket, gitlabUser)}>
                        Begin
                    </div>
                )
            }
        </>
  )
}

export default Buttons