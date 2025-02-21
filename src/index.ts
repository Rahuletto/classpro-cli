#!/usr/bin/env node

import { deployCommand } from './commands/deploy.js';
import { showHelp } from './commands/help.js';
import { configCommand } from './commands/config.js';
import { initCommand } from './commands/init.js';
import { syncCommand } from './commands/sync.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

async function main() {
    const command = process.argv[2] || 'help';

    switch (command) {
        case 'init':
            await initCommand();
            break;

        case 'deploy':
            await deployCommand();
            break;

        case 'config':
            await configCommand();
            break;

        case 'sync':
        case 'upgrade':
            await syncCommand();
            break;

        case 'help':
        case '--help':
        case '-h':
            showHelp();
            break;

        case '':
            showHelp();
            break;
        
        case '--version':
        case 'version':
        case '-v':
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);
            const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));
            console.log(`classpro v${packageJson.version}`);
            break;

        default:
            console.error(`❌ Unknown command: ${command}`);
            showHelp();
            process.exit(1);
    }
}

main();