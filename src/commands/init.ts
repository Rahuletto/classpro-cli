import { blue, cyan, green, red, yellow } from "colorette";
import { execAsync } from "../utils/execAsync.js";
import { setupEnvironment } from "./config.js";
import { promises as fs } from 'fs';
import { join } from 'path';
import prompts from 'prompts';

export async function initCommand() {
    try {
        console.log(blue('🚀 Setting up Classpro...'));

        try {
            await execAsync('git --version');
        } catch (error) {
            console.error(red('❌ Git is not installed. Please install Git first.'));
            process.exit(1);
        }

        let useGitHubCLI = true;
        try {
            await execAsync('gh --version');
            await execAsync('gh auth status');
        } catch (error) {
            const response = await prompts({
                type: 'confirm',
                name: 'installGH',
                message: 'GitHub CLI (gh) is not installed. Would you like to install it? (Recommended for better experience)',
                initial: true
            });

            if (response.installGH) {
                console.error(yellow('Please follow these steps:'));
                console.error(yellow('1. Install GitHub CLI (gh) from https://cli.github.com'));
                console.error(yellow('2. Run "gh auth login" to authenticate'));
                console.error(yellow('3. Then run this command again'));
                process.exit(1);
            } else {
                useGitHubCLI = false;
            }
        }

        console.log(blue('🔐 Setting up environment variables...'));

        const { frontendEnv, backendEnv } = await setupEnvironment();

        console.log(blue('📦 Forking and cloning repositories...'));
        try {
            if (useGitHubCLI) {
                const { stdout: username } = await execAsync('gh api user -q .login');
                
                try {
                    await execAsync(`gh repo view ${username.trim()}/classpro`);
                    await execAsync(`gh repo clone ${username.trim()}/classpro`);
                } catch {
                    await execAsync('gh repo fork rahuletto/classpro --clone=true --remote=true');
                }

                try {
                    await execAsync(`gh repo view ${username.trim()}/goscraper`);
                    await execAsync(`gh repo clone ${username.trim()}/goscraper`);
                } catch {
                    await execAsync('gh repo fork rahuletto/goscraper --clone=true --remote=true');
                }
            } else {
                console.log(blue('📦 Cloning repositories using git...'));
                
                await execAsync('git clone https://github.com/rahuletto/classpro.git');
                
                await execAsync('git clone https://github.com/rahuletto/goscraper.git');
                
                console.log(yellow('⚠️ Note: Without GitHub CLI, you won\'t have fork functionality.'));
                console.log(yellow('To contribute, you\'ll need to fork manually through GitHub\'s website.'));
            }

            await execAsync('mv classpro frontend');
            await execAsync('mv goscraper backend');
        } catch (error) {
            console.error(red('❌ Error handling repositories:'), error);
            process.exit(1);
        }

        await fs.writeFile(join('frontend', '.env.local'), frontendEnv);
        await fs.writeFile(join('backend', '.env'), backendEnv);

        console.log(green('✅ Setup completed successfully!'));

        try {
            await execAsync('go version');
        } catch (error) {
            console.error(blue('❌ Go is not installed.'));
            console.error(blue('Please install Go from https://golang.org/dl/ | Recommended version >= 1.23.2'));
            process.exit(1);
        }


        console.log(cyan('\n📝 Next steps:'));
        console.log(yellow('1. cd frontend && npm install (or yarn/pnpm install)'));
        console.log(yellow('2. cd ../backend && go mod tidy'));
        console.log(yellow('3. Go to https://github.com/rahuletto/goscraper and setup database'));
        console.log(yellow('\n⚠️ Important Configuration:'));
        console.log(yellow('After starting your services, update these environment variables:'));
        console.log(yellow('- In frontend/.env.local: Set NEXT_PUBLIC_URL to your backend URL (e.g., http://localhost:8080)'));
        console.log(yellow('- In backend/.env: Set URL to your frontend URL (e.g., http://localhost:0243)'));
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}