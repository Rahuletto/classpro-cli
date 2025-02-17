#!/usr/bin/env node

import { deployCommand } from './commands/deploy';
import { showHelp } from './commands/help';
import { configCommand } from './commands/config';
import { initCommand } from './commands/init';

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