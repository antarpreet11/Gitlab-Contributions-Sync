import React from 'react'
import { Project } from '../util/types';
import styles from "../page.module.css";

interface RepositoriesProps {
    projects: Project[];
    selectedProjects: Project[];
    toggleProjectSelection: (project: Project) => void;
}

const Repositories = ({ projects, selectedProjects, toggleProjectSelection }: RepositoriesProps) => {
  return (
    <div className={styles.repoList}>
        {projects.map((project: Project) => {
        const isChecked = selectedProjects.some(p => p.id === project.id);
        return (
            <div key={project.id} className={styles.repo}>
            <label>
                <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleProjectSelection(project)}
                />
                <span>{project.name}</span>
            </label>
            </div>
        );
        })}
    </div>
  )
}

export default Repositories