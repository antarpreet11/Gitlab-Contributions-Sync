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
        if (message.type === 'GITLAB_INIT') {
            try {
                gitlab.setUser(message.data);
                const projects = yield gitlab.getProjects();
                ws.send(JSON.stringify({ type: 'GITLAB_PROJECTS', data: projects }));
            }
            catch (error) {
                ws.send(JSON.stringify({ type: 'GITLAB_ERROR', data: error.message }));
            }
        }
    }));
});
