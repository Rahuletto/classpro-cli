#!/usr/bin/env node

import { deployCommand } from './commands/deploy.js';
import { showHelp } from './commands/help.js';
import { configCommand } from './commands/config.js';
import { initCommand } from './commands/init.js';
import { setupDbCommand } from './commands/setupDb.js';
import { syncCommand } from './commands/sync.js';

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
        case 'setupdb':
            await setupDbCommand();
            break;

        case 'sync':
            await syncCommand();
            break;

        case 'help':
        case '--help':
        case '-h':
            showHelp();
            break;

        default:
            console.error(`❌ Unknown command: ${command}`);
            showHelp();
            process.exit(1);
    }
}

main();