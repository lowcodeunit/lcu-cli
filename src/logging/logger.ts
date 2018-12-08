import Chalk from 'chalk';
import figlet from 'figlet';

export class Logger {
    static Basic(message: any) {
        console.log(message);
    }
    
    static Headline(headline: string) {
        this.Basic(Chalk.blue(
            figlet.textSync(headline, { horizontalLayout: 'full' })
        ));
    }
}