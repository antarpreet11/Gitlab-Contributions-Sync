import { makeRequest } from "./util/utils";

const API_URL = 'https://api.github.com';

export class GithubAPI {
    headers: Record<string, string>;

    constructor() {
        this.headers =  {}
    }

    initAPI(token: string) {
        this.headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }

    async getUserEmail() {
        try {
            const url = `${API_URL}/user/emails`;
            const emails = await makeRequest({ method: 'GET', url, headers: this.headers });
            emails.forEach((e: any) => {
                if (e.primary) {
                    return e.email;
                }
            });
            return emails[0].email;
        }
        catch (err) {
            throw new Error("Failed to get user email");
        }
    }

    async getUser() {
        try {
            const url = `${API_URL}/user`;
            const email = await this.getUserEmail();
            const user = await makeRequest({ method: 'GET', url, headers: this.headers });
            return {
                owner: user.login,
                username: user.login,
                mail: email 
            }
        } catch (err) {
            throw new Error("Failed to get user");
        }
    }

    async getRepos() {
        try {
            const url = `${API_URL}/user/repos`;
            const repos = await makeRequest({ method: 'GET', url, headers: this.headers });
            return repos.map((r: any) => r.name);
        } catch (err) {
            throw new Error("Failed to get repos");
        }
    }

    async createRepo(repo: any) {
        try {
            const url = `${API_URL}/user/repos`;
            return await makeRequest({ method: 'POST', url, headers: this.headers, body: repo });
        } catch (err) {
            throw new Error("Failed to create repo:" + err);
        }
    }

    async getLatestCommit(owner: string, repo: string, branch: string) {
        try {    
            const url = `${API_URL}/repos/${owner}/${repo}/commits/${branch}`;

            return await makeRequest({method: 'GET', url, headers: this.headers});
        } catch (err) {
            throw new Error("Failed to get latest commit");
        }
    }

    async createCommit(owner: string, repo:string, commit: any) {
        const body = commit;
        const url = `${API_URL}/repos/${owner}/${repo}/git/commits`;

        return makeRequest({method: 'POST', url, headers: this.headers, body});
    }

    async getTree(owner: string, repo: string, sha: string) {
        try {
            const url = `${API_URL}/repos/${owner}/${repo}/git/trees/${sha}`;
    
            return await makeRequest({method: 'GET', url, headers: this.headers});
        } catch (err) {
            throw new Error("Failed to get tree");
        }
    }

    async modifyTree(owner: string, repo:string, baseTree: string, treeEntries: any[]) {
        const body = {
            tree: treeEntries,
            base_tree: baseTree
        };
        return this._handleTreeOps(owner, repo, body);
    }

    async _handleTreeOps(owner: string, repo: string, body: any) {
        const url = `${API_URL}/repos/${owner}/${repo}/git/trees`;

        return makeRequest({method: 'POST', url, headers: this.headers, body});
    }

    async getBlob(owner: string, repo: string, sha: string) {
        const url = `${API_URL}/repos/${owner}/${repo}/git/blobs/${sha}`;

        return await makeRequest({method: 'GET', url, headers: this.headers});
    }

    async updateRef(owner: string, repo: string, branch: string, commit_sha: string, force = false) {
        const url = `${API_URL}/repos/${owner}/${repo}/git/refs/heads/${branch}`;

        return makeRequest({method: 'PATCH', url, headers: this.headers,
        body: {
            sha: commit_sha,
            force: force
        }});
    }
}