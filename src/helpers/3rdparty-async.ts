import download from 'download-git-repo';
import rimraf from 'rimraf';

export class AsyncHelpers {
    static downloadGit(repo: string, downloadToPath: string, host?: 'github' | 'gitlab' | 'bitbucket') {
        return new Promise<void>((resolve, reject) => {
            if (host && !repo.startsWith(host))
                repo = `${host}:${repo}`;
            
            download(repo, downloadToPath, async (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
    
    static rimraf(files: string) {
        return new Promise<void>((resolve, reject) => {
            
            rimraf(files, async (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}