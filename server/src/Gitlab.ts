import { makeRequest } from "./util/utils";

interface User {
    access_token: string;
    domain: string;
}

interface Project {
    id: string;
    name: string;
}

interface Commit {
    id: string;
    created_at: string;
    message: string;
    repository: string;
    author_name: string;
    author_email: string;
}

export class Gitlab {
    private user: User;
    projects: Project[];
    commits: Commit[];
    userName: string;

    constructor() {
        this.user = {
            access_token: '',
            domain: ''
        };
        this.userName = '';

        this.projects = [];
        this.commits = [];
    }
    
    setUser(user: User) {
        let { access_token, domain } = user;
        if (domain.includes('https://')) {
            domain = domain.replace('https://', '');
        } 
        if (!domain || !access_token) {
            throw new Error('Invalid user');
        }

        this.user = { access_token, domain };
    }

    async getUserName(): Promise<any> {
        try {
            const url = `https://${this.user.domain}/api/v4/user`;
            const headers = {
                'PRIVATE-TOKEN': this.user.access_token
            };
            let user = await makeRequest({ method: 'GET', url, headers });
            this.userName = user.username;
        } catch (err) {
            throw new Error("Failed to get user email");
        }
    }

    async getProjects(): Promise<any> {
        try {
            const url = `https://${this.user.domain}/api/v4/projects?membership=1`;
            const headers = {
                'PRIVATE-TOKEN': this.user.access_token
            }; 
    
            let projs = await makeRequest({ method: 'GET', url, headers });
            return this._setListOfProjects(projs);
        } catch (err) {
            throw new Error("Failed to get projects");
        };
    }

    _setListOfProjects(projects: any): Project[] {
        this.projects = projects.map((project: any) => {
            return {
                id: project.id,
                name: project.name
            };
        });

        return this.projects;
    }

    async _getProjectCommits(project: Project): Promise<any> {
        try {
            const url = `https://${this.user.domain}/api/v4/projects/${project.id}/repository/commits?author=${this.userName}`;
            const headers = {
                'PRIVATE-TOKEN': this.user.access_token
            };
            return this._getListOfCommits(await makeRequest({ method: 'GET', url, headers }), project); 
        } catch (err) {
            throw new Error("Failed to get commits for project: " + project.name);
        };
    }

    _getListOfCommits(commits: any, project: Project): Commit[] {
        return commits.map((commit: any) => {
            return {
                id: commit.id,
                created_at: commit.created_at,
                message: commit.message,
                repository: project.name,
                author_name: commit.author_name,
                author_email: commit.author_email
            };
        });
    }

    async getAllUserCommits(selectedProjects: Project[]): Promise<any> {
        let commits: Commit[] = [];
        for (let project of selectedProjects) {
            commits = commits.concat(await this._getProjectCommits(project));
        }
        this.commits = commits;
        return commits;
    }
}