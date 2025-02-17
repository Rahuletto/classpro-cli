import { blue, cyan, green, red, yellow } from "colorette";
import { execAsync } from "../utils/execAsync";
import { setupEnvironment } from "./config";
import { promises as fs } from 'fs';
import { join } from 'path';

export async function initCommand() {
    try {
        console.log(blue('🚀 Setting up Classpro...'));


        try {
            await execAsync('git --version');
        } catch (error) {
            console.error(red('❌ Git is not installed. Please install Git first.'));

            process.exit(1);
        }

        try {
            await execAsync('gh --version');
            await execAsync('gh auth status');
        } catch (error) {
            console.error(red('❌ GitHub CLI (gh) is not installed or not authenticated.'));

            console.error('Please follow these steps:');
            console.error('1. Install GitHub CLI (gh) from https://cli.github.com');
            console.error('2. Run "gh auth login" to authenticate');
            process.exit(1);
        }

        console.log(blue('🔐 Setting up environment variables...'));

        const { frontendEnv, backendEnv } = await setupEnvironment();


        await fs.mkdir('frontend', { recursive: true });
        await fs.mkdir('backend', { recursive: true });

        console.log(blue('📦 Forking and cloning repositories...'));
        try {
            await execAsync('gh repo fork rahuletto/classpro --clone=true --remote=true');
            await execAsync('mv classpro frontend');
            await execAsync('gh repo fork rahuletto/goscraper --clone=true --remote=true');
            await execAsync('mv goscraper backend');
        } catch (error) {
            console.error('❌ Error forking repositories:', error);
            process.exit(1);
        }

        await fs.writeFile(join('frontend', '.env.local'), frontendEnv);
        await fs.writeFile(join('backend', '.env'), backendEnv);

        console.log(green('✅ Setup completed successfully!'));
        console.log(cyan('\n📝 Next steps:'));
        console.log(yellow('1. cd frontend && npm install (or yarn/pnpm install)'));
        console.log(yellow('2. cd ../backend && go mod tidy'));
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}