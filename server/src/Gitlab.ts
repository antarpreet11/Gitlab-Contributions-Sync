import { makeRequest } from "./util/utils";

interface User {
    access_token: string;
    domain: string;
}

interface Project {
    id: string;
    name: string;
    default_branch: string;
    selectedBranch?: string;
}

interface Commit {
    id: string;
    created_at: string;
    message: string;
    repository: string;
    author_name: string;
    author_email: string;
}

interface RepoCommits {
    project: Project;
    commits: Commit[];
}

export class Gitlab {
    private user: User;
    projects: Project[];
    repoCommits: RepoCommits[];
    userName: string;
    userEmail: string;
    authorEmailOverride: string;

    constructor() {
        this.user = {
            access_token: '',
            domain: ''
        };
        this.userName = '';
        this.userEmail = '';
        this.authorEmailOverride = '';

        this.projects = [];
        this.repoCommits = [];
    }

    setUser(user: User & { author_email?: string }) {
        let { access_token, domain, author_email } = user;
        if (domain.includes('https://')) {
            domain = domain.replace('https://', '');
        }
        if (!domain || !access_token) {
            throw new Error('Invalid user');
        }

        this.user = { access_token, domain };
        this.authorEmailOverride = author_email || '';
    }

    async getUserName(): Promise<any> {
        try {
            const url = `https://${this.user.domain}/api/v4/user`;
            const headers = {
                'PRIVATE-TOKEN': this.user.access_token
            };
            let user = await makeRequest({ method: 'GET', url, headers });
            this.userName = user.name || user.username;
            this.userEmail = user.email || '';
            const effectiveFilter = this.authorEmailOverride || this.userEmail || this.userName;
            console.log(`\x1b[36m[GitLab]\x1b[0m authenticated as \x1b[32m${this.userName}\x1b[0m <${this.userEmail}> — author filter: \x1b[33m${effectiveFilter}\x1b[0m`);
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
                name: project.name,
                default_branch: project.default_branch || 'main'
            };
        });

        return this.projects;
    }

    async _getProjectCommits(project: Project, since?: string): Promise<any> {
        try {
            const branch = project.selectedBranch || project.default_branch;
            const authorFilter = this.authorEmailOverride || this.userEmail || this.userName;
            const headers = { 'PRIVATE-TOKEN': this.user.access_token };
            const sinceParam = since ? `&since=${encodeURIComponent(since)}` : '';

            const allCommits: any[] = [];
            let page = 1;
            while (true) {
                const url = `https://${this.user.domain}/api/v4/projects/${project.id}/repository/commits?author=${encodeURIComponent(authorFilter)}&ref_name=${encodeURIComponent(branch)}&per_page=100&page=${page}${sinceParam}`;
                const batch = await makeRequest({ method: 'GET', url, headers });
                if (!batch || batch.length === 0) break;
                allCommits.push(...batch);
                if (batch.length < 100) break;
                page++;
            }
            const sinceNote = since ? ` [since ${since}]` : '';
            console.log(`\x1b[36m[GitLab]\x1b[0m \x1b[32m${project.name}\x1b[0m (${branch}) — \x1b[33m${allCommits.length}\x1b[0m commit(s) [filter: ${authorFilter}]${sinceNote}`);
            return this._getListOfCommits(allCommits, project);
        } catch (err) {
            throw new Error("Failed to get commits for project: " + project.name);
        };
    }

    async getProjectCommitsSince(project: Project, since: string): Promise<any> {
        return this._getProjectCommits(project, since);
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

    async getAllUserCommits(selectedProjects: Project[]): Promise<RepoCommits[]> {
        let rep: RepoCommits[] = [];
        for (let project of selectedProjects) {
            rep.push({
                project: project,
                commits: await this._getProjectCommits(project)
            });
        }
        this.repoCommits = rep;
        return this.repoCommits;
    }
}