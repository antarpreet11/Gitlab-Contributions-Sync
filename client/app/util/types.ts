export interface User {
    access_token: string;
    domain: string;
};
  
export interface Project {
    id: string;
    name: string;
}

export interface GitlabUser {
    gitLabAccessToken: string;
    gitLabDomain: string;
};

export interface GithubUser {
    githubAccessToken: string;
    githubRefreshToken: string;
};
