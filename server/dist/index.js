"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const Gitlab_1 = require("./Gitlab");
const wss = new ws_1.WebSocketServer({ port: 8080 });
wss.on('connection', function connection(ws) {
    const gitlab = new Gitlab_1.Gitlab();
    ws.on('message', (data) => __awaiter(this, void 0, void 0, function* () {
        const message = JSON.parse(data.toString());
        console.log('Received message:', message.type);
        if (message.type === 'GITLAB_INIT') {
            try {
                gitlab.setUser(message.data);
                yield gitlab.getUserName();
                const projects = yield gitlab.getProjects();
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
            }
            catch (error) {
                ws.send(JSON.stringify({ type: 'ERROR', data: error.message }));
            }
        }
        else if (message.type === 'GITLAB_GET_COMMITS') {
            try {
                const projects = message.data.projects;
                const commits = yield gitlab.getAllUserCommits(projects);
                ws.send(JSON.stringify({ type: 'GITLAB_COMMITS', data: commits }));
            }
            catch (error) {
                ws.send(JSON.stringify({ type: 'ERROR', data: error.message }));
            }
        }
    }));
});
