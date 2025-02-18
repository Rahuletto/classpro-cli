import { blue, green, red, yellow } from "colorette";
import { promises as fs } from 'fs';
import { join } from 'path';
import prompts from 'prompts';
import { checkFoldersExist } from "../utils/exists.js";
import { generateEncryptionKey } from "../utils/generate.js";
import { execAsync } from "../utils/execAsync.js";

export async function configCommand(args?: string[]) {
    if (!await checkFoldersExist()) {
        console.error(red('❌ Frontend or backend folders not found!'));
        console.error(yellow('Please run "classpro init" first to set up the project.'));
        process.exit(1);
    }

    if (args?.includes('urls')) {
        await configureUrls();
        return;
    }

    if (args?.includes('reset')) {
        await resetConfig();
        return;
    }

    console.log(blue('🔐 Updating configuration...'));
    const { frontendEnv, backendEnv } = await setupEnvironment();

    await fs.writeFile(join('frontend', '.env.local'), frontendEnv);
    await fs.writeFile(join('backend', '.env'), backendEnv);
    
    console.log(green('✅ Configuration updated successfully!'));
}

async function configureUrls() {
    console.log(blue('🔗 Configuring URLs...'));

    const response = await prompts([
        {
            type: 'text',
            name: 'backendUrl',
            message: 'Enter your backend URL (e.g., http://localhost:8080):',
            initial: 'http://localhost:8080'
        },
        {
            type: 'text',
            name: 'frontendUrl',
            message: 'Enter your frontend URL (e.g., http://localhost:3000):',
            initial: 'http://localhost:3000'
        }
    ]);

    try {
        // Read existing env files
        const frontendEnv = await fs.readFile(join('frontend', '.env.local'), 'utf-8');
        const backendEnv = await fs.readFile(join('backend', '.env'), 'utf-8');

        // Update URLs
        const updatedFrontendEnv = frontendEnv.replace(
            /NEXT_PUBLIC_URL="[^"]*"/,
            `NEXT_PUBLIC_URL="${response.backendUrl}"`
        );

        const updatedBackendEnv = backendEnv.replace(
            /URL="[^"]*"/,
            `URL="${response.frontendUrl}"`
        );

        // Write updated env files
        await fs.writeFile(join('frontend', '.env.local'), updatedFrontendEnv);
        await fs.writeFile(join('backend', '.env'), updatedBackendEnv);

        console.log(green('✅ URLs updated successfully!'));
    } catch (error) {
        console.error(red('❌ Error updating URLs:'), error);
        process.exit(1);
    }
}
async function resetConfig() {
    console.log(blue('🔄 Resetting configuration...'));
    try {
        await fs.unlink(join('frontend', '.env.local'));
        await fs.unlink(join('backend', '.env'));
        console.log(green('✅ Configuration files reset successfully!'));
        console.log(yellow('Run "classpro config" to set up new configuration.'));
    } catch (error) {
        console.error(red('❌ Error resetting configuration:'), error);
        process.exit(1);
    }
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
