import { execAsync } from '../utils/execAsync.js';
import { checkFoldersExist } from '../utils/exists.js';
import { red, blue, green, yellow } from 'colorette';

export async function syncCommand() {
    if (!await checkFoldersExist()) {
        console.error(red('❌ Frontend or backend folders not found!'));
        console.info(yellow('Please run "classpro init" first to set up the project.'));
        process.exit(1);
    }

    console.log(blue('🔄 Syncing repositories with upstream...'));

    try {
        console.log(blue('📦 Syncing frontend repository...'));
        await execAsync('cd frontend && git fetch upstream && git checkout main && git merge upstream/main');
        console.log(green('✅ Frontend repository synced successfully!'));

        console.log(blue('📦 Syncing backend repository...'));
        await execAsync('cd backend && git fetch upstream && git checkout main && git merge upstream/main');
        console.log(green('✅ Backend repository synced successfully!'));

        console.log(green('✅ All repositories synced successfully!'));
    } catch (error) {
        console.error(red('❌ Error syncing repositories:'), error);
        process.exit(1);
    }
}