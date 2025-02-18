import { red, yellow } from "colorette";
import { execAsync } from "../utils/execAsync.js";
import { checkFoldersExist } from "../utils/exists.js";

export async function deployCommand() {
    if (!await checkFoldersExist()) {
        console.error(red('❌ Frontend or backend folders not found!'));
        console.info(yellow('Please run "classpro init" first to set up the project.'));
        process.exit(1);
    }

    console.log('🚀 Deploying Classpro...');

    try {
        console.log('📦 Building and starting frontend...');
        await execAsync('cd frontend && npm run build && npm start');
    } catch (error) {
        console.error('❌ Error deploying frontend:', error);
        process.exit(1);
    }

    try {
        console.log('📦 Building and starting backend...');
        await execAsync('cd backend && go build && ./goscraper');
    } catch (error) {
        console.error('❌ Error deploying backend:', error);
        process.exit(1);
    }
}
