import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function loadCommands(client) {
    const commandsPath = path.join(__dirname, '../../commands');

    async function loadCommandsRecursive(dir) {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                await loadCommandsRecursive(filePath);
            } else if (file.endsWith('.js')) {
                try {
                    const command = (await import(`file://${filePath}`)).default;

                    if (command.data?.name) {
                        // Register main command
                        client.commands.set(command.data.name, command);
                        logger.info(`✓ Loaded command: ${command.data.name}`);

                        // Register aliases/shortcuts
                        if (command.aliases && Array.isArray(command.aliases)) {
                            for (const alias of command.aliases) {
                                client.commands.set(alias, command);
                                logger.info(`✓ Registered alias: ${alias} → ${command.data.name}`);
                            }
                        }
                    }
                } catch (error) {
                    logger.error(`Failed to load command from ${filePath}:`, error);
                }
            }
        }
    }

    await loadCommandsRecursive(commandsPath);
    logger.info(`✓ Loaded ${client.commands.size} commands and aliases total`);
}
