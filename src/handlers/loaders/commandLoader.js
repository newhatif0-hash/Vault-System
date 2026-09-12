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

                    if (command.data && command.data.name) {
                        client.commands.set(command.data.name, command);
                        logger.info(`✓ Loaded command: ${command.data.name}`);
                    }
                } catch (error) {
                    logger.error(`Failed to load command from ${filePath}:`, error);
                }
            }
        }
    }

    await loadCommandsRecursive(commandsPath);
    logger.info(`✓ Loaded ${client.commands.size} commands`);
}

export function registerCommands(client) {
    const commands = [];
    let totalSubcommands = 0;
    const registeredNames = new Set();

    for (const command of client.commands.values()) {
        const commandName = command.data.name;

        if (registeredNames.has(commandName)) {
            logger.warn(`Duplicate command name: ${commandName}`);
            continue;
        }

        registeredNames.add(commandName);
        const commandJson = command.data.toJSON();
        commands.push(commandJson);
        totalSubcommands += getSubcommandInfo(commandJson).length;

        // Register shortcuts as separate commands
        if (command.shortcuts && Array.isArray(command.shortcuts)) {
            for (const shortcut of command.shortcuts) {
                if (!registeredNames.has(shortcut)) {
                    registeredNames.add(shortcut);
                    const shortcutJson = {
                        ...commandJson,
                        name: shortcut, // Change the name to the shortcut
                    };
                    commands.push(shortcutJson);
                    logger.debug(`Registering shortcut: ${shortcut} -> ${commandName}`);
                } else {
                    logger.warn(`Shortcut name already registered: ${shortcut}`);
                }
            }
        }

        if (process.env.NODE_ENV !== 'production') {
            logger.debug(`Registering command: ${commandName}`);
        }
    }

    logger.info(`Collected ${commands.length} command payloads (${totalSubcommands} subcommands)`);
    return { commands, totalSubcommands };
}

function getSubcommandInfo(commandJson) {
    const subcommands = [];

    if (commandJson.options && Array.isArray(commandJson.options)) {
        for (const option of commandJson.options) {
            if (option.type === 1 || option.type === 2) {
                // Subcommand or SubcommandGroup
                subcommands.push({
                    name: option.name,
                    type: option.type === 1 ? 'Subcommand' : 'SubcommandGroup',
                });
            }
        }
    }

    return subcommands;
}
    logger.info(`✓ Loaded ${client.commands.size} commands`);
}

export function collectCommandPayloads(client) {
    const commands = [];
    let totalSubcommands = 0;
    const registeredNames = new Set();

    for (const command of client.commands.values()) {
        const commandName = command.data.name;

        if (registeredNames.has(commandName)) {
            logger.warn(`Duplicate command name: ${commandName}`);
            continue;
        }

        registeredNames.add(commandName);
        const commandJson = command.data.toJSON();
        commands.push(commandJson);
        totalSubcommands += getSubcommandInfo(commandJson).length;

        // ← START OF NEW CODE BLOCK
        // Register shortcuts as separate commands
        if (command.shortcuts && Array.isArray(command.shortcuts)) {
            for (const shortcut of command.shortcuts) {
                if (!registeredNames.has(shortcut)) {
                    registeredNames.add(shortcut);
                    const shortcutJson = {
                        ...commandJson,
                        name: shortcut, // Change the name to the shortcut
                    };
                    commands.push(shortcutJson);
                    logger.debug(`Registering shortcut: ${shortcut} -> ${commandName}`);
                } else {
                    logger.warn(`Shortcut name already registered: ${shortcut}`);
                }
            }
        }
        // ← END OF NEW CODE BLOCK

        if (process.env.NODE_ENV !== 'production') {
            logger.debug(`Registering command: ${commandName}`);
        }
    }

    logger.info(`Collected ${commands.length} command payloads (${totalSubcommands} subcommands)`);
    return { commands, totalSubcommands };
}

function getSubcommandInfo(commandJson) {
    const subcommands = [];

    if (commandJson.options && Array.isArray(commandJson.options)) {
        for (const option of commandJson.options) {
            if (option.type === 1 || option.type === 2) {
                // Subcommand or SubcommandGroup
                subcommands.push({
                    name: option.name,
                    type: option.type === 1 ? 'Subcommand' : 'SubcommandGroup',
                });
            }
        }
    }

    return subcommands;
}
