import { WebSocketServer } from 'ws';
import { Gitlab } from './Gitlab';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
    const gitlab = new Gitlab();

    ws.on('message', async (data) => {
        const message = JSON.parse(data.toString());
        console.log('Received message:', message.type);

        if (message.type === 'GITLAB_INIT') {
            try {
                gitlab.setUser(message.data);
                await gitlab.getUserName();
                const projects = await gitlab.getProjects();
                // const projects = [{
                //     id: 1,
                //     name: 'Project 1'
                // }, {
                //     id: 2,
                //     name: 'Project 2'
                // }, {
                //     id: 3,
                //     name: 'Project 3'
                // }, {
                //     id: 4,
                //     name: 'Project 4'
                // }, {
                //     id: 5,
                //     name: 'Project 5'
                // }, {    
                //     id: 6,
                //     name: 'Project 6'
                // }, {
                //     id: 7,
                //     name: 'Project 7'
                // }, {
                //     id: 8,
                //     name: 'Project 8'
                // }, {
                //     id: 9,
                //     name: 'Project 9'
                // }, {
                //     id: 10,
                //     name: 'Project 10'
                // }]
    
                ws.send(JSON.stringify({ type: 'GITLAB_PROJECTS', data: projects }));
            } catch (error: any) {
                ws.send(JSON.stringify({ type: 'ERROR', data: error.message }));
            }
        } else if (message.type === 'GITLAB_GET_COMMITS') {
            try {
                const projects = message.data.projects;
                const commits = await gitlab.getAllUserCommits(projects);

                ws.send(JSON.stringify({ type: 'GITLAB_COMMITS', data: commits }));
            } catch (error: any) {
                ws.send(JSON.stringify({ type: 'ERROR', data: error.message }));
            }
        }
    });

});