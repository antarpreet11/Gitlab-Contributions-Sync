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
exports.Gitlab = void 0;
const utils_1 = require("./util/utils");
class Gitlab {
    constructor() {
        this.user = {
            access_token: '',
            domain: ''
        };
        this.projects = [];
        this.commits = [];
    }
    setUser(user) {
        let { access_token, domain } = user;
        if (domain.includes('https://')) {
            domain = domain.replace('https://', '');
        }
        if (!domain || !access_token) {
            throw new Error('Invalid user');
        }
        this.user = { access_token, domain };
    }
    getProjects() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `https://${this.user.domain}/api/v4/projects?membership=1`;
                const headers = {
                    'PRIVATE-TOKEN': this.user.access_token
                };
                let projs = yield (0, utils_1.makeRequest)({ method: 'GET', url, headers });
                return this._setListOfProjects(projs);
            }
            catch (err) {
                throw new Error("Failed to get projects");
            }
            ;
        });
    }
    _setListOfProjects(projects) {
        this.projects = projects.map((project) => {
            return {
                id: project.id,
                name: project.name
            };
        });
        return this.projects;
    }
    _getProjectCommits(project) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `https://${this.user.domain}/api/v4/projects/${project.id}/repository/commits`;
                const headers = {
                    'PRIVATE-TOKEN': this.user.access_token
                };
                return this._getListOfCommits(yield (0, utils_1.makeRequest)({ method: 'GET', url, headers }), project);
            }
            catch (err) {
                throw new Error("Failed to get commits for project: " + project.name);
            }
            ;
        });
    }
    _getListOfCommits(commits, project) {
        return commits.map((commit) => {
            return {
                id: commit.id,
                created_at: commit.created_at,
                message: commit.message,
                repository: project.name
            };
        });
    }
    getAllUserCommits(selectedProjects) {
        return __awaiter(this, void 0, void 0, function* () {
            let commits = [];
            for (let project of selectedProjects) {
                commits = commits.concat(yield this._getProjectCommits(project));
            }
            this.commits = commits;
            return commits;
        });
    }
}
exports.Gitlab = Gitlab;
