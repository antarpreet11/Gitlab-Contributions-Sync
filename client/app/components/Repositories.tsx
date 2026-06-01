import React from 'react'
import { Project } from '../util/types';
import styles from "../page.module.css";

interface RepositoriesProps {
    projects: Project[];
    selectedProjects: Project[];
    toggleProjectSelection: (project: Project) => void;
    updateProjectBranch: (projectId: string, branch: string) => void;
}

const Repositories = ({ projects, selectedProjects, toggleProjectSelection, updateProjectBranch }: RepositoriesProps) => {
  return (
    <div className={styles.repoList}>
        {projects.map((project: Project) => {
        const selected = selectedProjects.find(p => p.id === project.id);
        const isChecked = !!selected;
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
            {isChecked && (
                <input
                    type="text"
                    className={styles.branchInput}
                    value={selected?.selectedBranch ?? project.default_branch}
                    onChange={(e) => updateProjectBranch(project.id, e.target.value)}
                    placeholder="branch"
                />
            )}
            </div>
        );
        })}
    </div>
  )
}

export default Repositories
