export declare class AsyncHelpers {
    static downloadGit(repo: string, downloadToPath: string, host?: 'github' | 'gitlab' | 'bitbucket'): Promise<void>;
    static rimraf(files: string): Promise<void>;
}
