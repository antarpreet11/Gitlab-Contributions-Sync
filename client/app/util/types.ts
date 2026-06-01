export interface User {
    access_token: string;
    domain: string;
};
  
export interface Project {
    id: string;
    name: string;
    default_branch: string;
    selectedBranch?: string;
}

export interface GitlabUser {
    gitLabAccessToken: string;
    gitLabDomain: string;
    gitLabAuthorEmail?: string;
};

export interface GithubUser {
    githubAccessToken: string;
    githubRefreshToken: string;
};
