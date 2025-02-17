import { promises as fs } from 'fs';
import { join } from 'path';
import { generateEncryptionKey } from '../utils/generate';
import prompts from 'prompts';
import { execAsync } from '../utils/execAsync';
import { checkFoldersExist } from '../utils/exists';

export async function configCommand() {
    if (!await checkFoldersExist()) {
        console.error('❌ Frontend or backend folders not found!');
        console.error('Please run "classpro init" first to set up the project.');
        process.exit(1);
    }

    console.log('🔐 Updating configuration...');
    const { frontendEnv, backendEnv } = await setupEnvironment();

    await fs.writeFile(join('frontend', '.env.local'), frontendEnv);
    await fs.writeFile(join('backend', '.env'), backendEnv);

    console.log('✅ Configuration updated successfully!');
}
export async function setupEnvironment() {
    const response = await prompts([
        {
            type: 'text',
            name: 'supabaseUrl',
            message: 'Enter your Supabase URL:'
        },
        {
            type: 'text',
            name: 'supabaseKey',
            message: 'Enter your Supabase Service Key:'
        },
        {
            type: 'text',
            name: 'validationKey',
            message: 'Enter your Validation Key (press Enter to generate one):',
            initial: () => execAsync('openssl rand -hex 32').then(({ stdout }) => stdout.trim())
        },
        {
            type: 'text',
            name: 'corsUrl',
            message: 'Enter your CORS URL (e.g., http://localhost:3000):'
        }
    ]);

    const encryptionKey = await generateEncryptionKey();

    const frontendEnv = `NEXT_PUBLIC_URL="${response.corsUrl}"
NEXT_PUBLIC_VALIDATION_KEY="${response.validationKey}"
NEXT_PUBLIC_SERVICE_KEY="${response.supabaseKey}"
NEXT_PUBLIC_SUPABASE_URL="${response.supabaseUrl}"`;

    // Create backend .env
    const backendEnv = `SUPABASE_URL="${response.supabaseUrl}"
SUPABASE_KEY="${response.supabaseKey}"
ENCRYPTION_KEY="${encryptionKey}"
VALIDATION_KEY="${response.validationKey}"
URL="${response.corsUrl}"`;

    return { frontendEnv, backendEnv };
}
