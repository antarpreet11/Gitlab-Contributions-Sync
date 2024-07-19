import { WebSocketServer } from 'ws';
import { Gitlab } from './Gitlab';
import { Github } from './Github';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
    const gitlab = new Gitlab();
    const github = new Github(ws);

    ws.on('message', async (data) => {
        const message = JSON.parse(data.toString());
        console.log('Received message:', message.type);

        if (message.type === 'GITLAB_INIT') {
            try {
                gitlab.setUser(message.data);
                await gitlab.getUserName();
                const projects = await gitlab.getProjects();
        
                ws.send(JSON.stringify({ type: 'GITLAB_PROJECTS', data: projects }));
            } catch (error: any) {
                ws.send(JSON.stringify({ type: 'ERROR', data: error.message }));
            }
        } else if (message.type === 'GITLAB_GET_COMMITS') {
            try {
                if (!gitlab.userName) {
                    throw new Error('User not initialized');
                }
                const projects = message.data.projects;
                const commits = await gitlab.getAllUserCommits(projects);

                ws.send(JSON.stringify({ type: 'GITLAB_COMMITS', data: commits }));
            } catch (error: any) {
                ws.send(JSON.stringify({ type: 'ERROR', data: error.message }));
            }
        // }
        } else if (message.type === 'GITHUB_INIT') {
            try {
                const user = await github.initUser(message.data.githubAccessToken, gitlab.repoCommits);
                await github.resolveRepo();
                await github.sync();
                ws.send(JSON.stringify({ type: 'GITHUB_INIT', data: user}));
            } catch (error: any) {
                ws.send(JSON.stringify({ type: 'ERROR', data: error.message }));
            }
        }
    });

});