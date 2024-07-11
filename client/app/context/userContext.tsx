import { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';
import { GithubUser, GitlabUser } from '../util/types';
interface GitlabUserContextType {
    gitlabUser: GitlabUser | null;
    setGitlabUser: Dispatch<SetStateAction<GitlabUser | null>>;
};

export const GitlabUserContext = createContext<GitlabUserContextType>({
    gitlabUser: null,
    setGitlabUser: () => {},
});

interface GithubUserContextType {
    githubUser: GithubUser | null;
    setGithubUser: Dispatch<SetStateAction<GithubUser | null>>;
};

export const GithubUserContext = createContext<GithubUserContextType>({
    githubUser: null,
    setGithubUser: () => {},
});

interface GitlabUserProviderProps {
    children: ReactNode;
};

interface GithubUserProviderProps {
    children: ReactNode;
};

export const GitlabUserProvider = ({ children }: GitlabUserProviderProps) => {
    const [gitlabUser, setGitlabUser] = useState<GitlabUser | null>({
        gitLabAccessToken: '',
        gitLabDomain: '',
    });
    const value = { gitlabUser, setGitlabUser };

    return (
        <GitlabUserContext.Provider value={value}>{children}</GitlabUserContext.Provider>
    );
};

export const GithubUserProvider = ({ children }: GithubUserProviderProps) => {
    const [githubUser, setGithubUser] = useState<GithubUser | null>({
        githubAccessToken: '',
        githubRefreshToken: '',
    });
    const value = { githubUser, setGithubUser };

    return (
        <GithubUserContext.Provider value={value}>{children}</GithubUserContext.Provider>
    );
};
