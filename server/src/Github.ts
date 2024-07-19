import { GithubAPI } from "./GithubAPI";

interface User {
    owner: string;
    username: string;
    mail: string;
    token: string;
}

interface GLProject {
    id: string;
    name: string;
}

interface GLCommit {
    id: string;
    created_at: string;
    message: string;
    repository: string;
    author_name: string;
    author_email: string;
}

interface RepoCommits {
    project: GLProject;
    commits: GLCommit[];
}


export class Github {
    user: User;
    api: GithubAPI; 
    repo: string;
    repoCommits: RepoCommits[];
    ws: any;

    constructor(wss: any) {
        this.user = {
            owner: '',
            username: '',
            mail: '',
            token: ''
        };
        this.api = new GithubAPI();
        this.repo = '';
        this.repoCommits = [];
        this.ws = wss;
    }

    async initUser(token: string, gitRepos: RepoCommits[], githubRepoName = "GitlabShadowContributions"): Promise<User> {
        try {
            this.api.initAPI(token);
            const user = await this.api.getUser();
            this.user = {
                owner: user.owner,
                username: user.username,
                mail: user.mail,
                token: token
            };
            this.repo = githubRepoName;
            this.repoCommits = gitRepos;

            this.ws.send(JSON.stringify({ type: 'UPDATE', data: "Syncing for user: " + this.user.username }));

            return this.user;
        } catch (err) {
            throw err;
        }
    }

    async _githubRepoExists() {
        try {
            const repos = await this.api.getRepos();
            // console.log(repos);
    
            return repos.includes(this.repo);
        } catch (err) {
            throw err;
        }
    }

    async _initShadowRepo() {
        try {
            console.log("Creating GitHub shadow repo...");
            this.ws.send(JSON.stringify({ type: 'UPDATE', data: "Creating GitHub shadow repo..." }));
    
            await this.api.createRepo(
                {
                    name: this.repo,
                    description: "Created by Gitlab-Contrubutions-Sync",
                    homepage: "https://github.com/antarpreet11/Gitlab-Contributions-Sync",
                    private: true,
                    auto_init: true
                }
            );

        } catch (err) {
            throw err;
        }
    }

    async resolveRepo() {
        try {
            const exists = await this._githubRepoExists();
            if (!exists) {
                await this._initShadowRepo();
            }
        } catch (err) {
            throw err;
        }
    }

    async _queryBlobSha(filename: string) {

        try {
            const head = await this.api.getLatestCommit(this.user.owner, this.repo, "main");

            const res = await this.api.getTree(this.user.owner, this.repo, head.commit.tree.sha)

            // Loop over blobs in tree
            for (let ii = 0; ii < res.tree.length; ii++) {
                const entry = res.tree[ii];

                if (entry.path === filename) {
                    return { exist: true, sha: entry.sha };
                }
            }

            return { exist: false, sha: null };

        } catch {
            throw new Error("Query for blob failed");
        }
    }

    async _getBlobContents(sha: string): Promise<string> {

        const response = await this.api.getBlob(this.user.owner, this.repo, sha);

        return Buffer.from(response.content, response.encoding).toString("utf8");
    }

    async _getOrInitShadowContent(repo: GLProject) {
        try {
            const shadowFilename = repo.name;

            const blob = await this._queryBlobSha(shadowFilename);

            let content;

            if (blob.exist) {
                content = await this._getBlobContents(blob.sha);
            } else {
                content = "";
            }

            return content;
        } catch (err) {
            throw err;
        }
    }

    async _mkOrUpdateShadow(repoName: string, commits: GLCommit[], content: string) {
        // Commit Bitbucket commit-hashes one by one to GitHub shadow files
        let commitsAdded = 0;

        let contentArray;

        for (let ii = 0; ii < commits.length; ii++) {
            const commit = commits[ii];

            // Convert lines in str to array for easier handling
            contentArray = content.split('\n')

            // Check that the Bitbucket hash is not already in the shadow file
            if (!contentArray.includes(commit.id)) {
                contentArray.push(commit.id)

                content = contentArray.join('\n').trim();

                // Commit
                await this._commitShadow(repoName, content, commit.created_at);
                commitsAdded += 1;
            }
        }

        // Print msg: "- Added X commits from [REPO/SHADOW NAME]"
        console.log(
            `- Added \x1b[33m${commitsAdded}\x1b[0m commits`
        ); 
        this.ws.send(JSON.stringify({ type: 'UPDATE', data: `Added ${commitsAdded} commits`}));
    }

    async _commitShadow(filename: string, content: any, date: string) {

        const head = await this.api.getLatestCommit(this.user.owner, this.repo, "main");

        const tree = await this.api.modifyTree(
            this.user.owner,
            this.repo,
            head.commit.tree.sha,
            [{
                path: filename,
                mode: "100644",
                type: "blob",
                content: content
            }]
        );

        const commit = await this.api.createCommit(this.user.owner, this.repo, {
            message: `Update ${filename}`,
            tree: tree.sha,
            parents: [head.sha],
            author: {
                name: this.user.username,
                email: this.user.mail,
                date: date
            }
        })

        await this.api.updateRef(this.user.owner, this.repo, "main", commit.sha);
    }

    async sync() {
        try {
            for (let i = 0; i < this.repoCommits.length; i++) {
                const repoName = this.repoCommits[i].project; 
                const commits = this.repoCommits[i].commits;
    
                console.log(`Syncing \x1b[32m${repoName.name}\x1b[0m (${i + 1}/${this.repoCommits.length})`);
                this.ws.send(JSON.stringify({ type: 'UPDATE', data: `Syncing ${repoName.name} (${i + 1}/${this.repoCommits.length})`}));
    
                const content = await this._getOrInitShadowContent(repoName);
                
                await this._mkOrUpdateShadow(repoName.name, commits, content);
            }
            this.ws.send(JSON.stringify({ type: 'UPDATE', data: "Sync complete" }));
        } catch (err) {
            throw err;
        }
    } 
}