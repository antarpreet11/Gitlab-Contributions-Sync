import { WebSocketServer } from 'ws';
import { Gitlab } from './Gitlab';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
    const gitlab = new Gitlab();

    ws.on('message', async (data) => {
        const message = JSON.parse(data.toString());

        if (message.type === 'GITLAB_INIT') {
            try {
                gitlab.setUser(message.data);
                const projects = await gitlab.getProjects();
    
                ws.send(JSON.stringify({ type: 'GITLAB_PROJECTS', data: projects }));
            } catch (error: any) {
                ws.send(JSON.stringify({ type: 'GITLAB_ERROR', data: error.message }));
            }
        }
    });

});