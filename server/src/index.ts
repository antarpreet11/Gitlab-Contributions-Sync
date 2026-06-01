import { WebSocketServer } from 'ws';
import { Gitlab } from './Gitlab';
import { Github } from './Github';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
    const gitlab = new Gitlab();
    const github = new Github(ws);

    ws.on('message', async (data) => {
        const message = JSON.parse(data.toString());

        if (message.type === 'GITLAB_INIT') {
            try {
                gitlab.setUser(message.data);
                await gitlab.getUserName();
                const projects = await gitlab.getProjects();
                console.log(`\x1b[36m[GitLab]\x1b[0m fetched \x1b[33m${projects.length}\x1b[0m projects`);
                ws.send(JSON.stringify({ type: 'GITLAB_PROJECTS', data: projects }));
            } catch (error: any) {
                console.error(`\x1b[31m[GitLab]\x1b[0m init failed — ${error.message}`);
                ws.send(JSON.stringify({ type: 'ERROR', data: error.message }));
            }
        } else if (message.type === 'GITLAB_GET_COMMITS') {
            try {
                if (!gitlab.userName) {
                    throw new Error('User not initialized');
                }
                const projects = message.data.projects;
                console.log(`\x1b[36m[GitLab]\x1b[0m fetching commits for \x1b[33m${projects.length}\x1b[0m repo(s)`);
                const commits = await gitlab.getAllUserCommits(projects);
                ws.send(JSON.stringify({ type: 'GITLAB_COMMITS', data: commits }));
            } catch (error: any) {
                console.error(`\x1b[31m[GitLab]\x1b[0m commits failed — ${error.message}`);
                ws.send(JSON.stringify({ type: 'ERROR', data: error.message }));
            }
        } else if (message.type === 'GITHUB_INIT') {
            try {
                const user = await github.initUser(message.data.githubAccessToken, gitlab.repoCommits);
                await github.resolveRepo();
                await github.sync();
                ws.send(JSON.stringify({ type: 'GITHUB_INIT', data: user}));
            } catch (error: any) {
                console.error(`\x1b[31m[GitHub]\x1b[0m sync failed — ${error.message}`);
                ws.send(JSON.stringify({ type: 'ERROR', data: error.message }));
            }
        }
    });

});