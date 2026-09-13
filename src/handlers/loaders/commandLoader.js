import { readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Load all commands from the commands directory
 * @param {Client} client - Discord.js client
 */
export async function loadCommands(client) {
  const commandsPath = path.join(__dirname, '../../commands');

  try {
    const categories = readdirSync(commandsPath);

    for (const category of categories) {
      const categoryPath = path.join(commandsPath, category);
      const files = readdirSync(categoryPath).filter(f => f.endsWith('.js'));

      for (const file of files) {
        try {
          const filePath = path.join(categoryPath, file);
          const fileURL = `file://${filePath}`;
          const commandModule = await import(fileURL);
          const command = commandModule.default || commandModule;

          if (!command.data || !command.data.name) {
            console.warn(`⚠️  Skipping ${file}: Missing data.name`);
            continue;
          }

          client.commands.set(command.data.name, command);
          console.log(`✅ Loaded: ${command.data.name}`);
        } catch (error) {
          console.error(`❌ Error loading ${file}:`, error.message);
        }
      }
    }

    console.log(`\n📊 Total commands loaded: ${client.commands.size}`);
  } catch (error) {
    console.error('❌ Error loading commands:', error);
  }
}

/**
 * Register slash commands for Discord API
 * @param {Client} client - Discord.js client
 * @returns {Object} { commands: Array, totalSubcommands: number }
 */
export function registerCommands(client) {
  const commands = [];
  let totalSubcommands = 0;

  for (const [, command] of client.commands) {
    if (!command.data || !command.data.name) continue;

    try {
      const commandJson = command.data.toJSON ? command.data.toJSON() : command.data;
      commands.push(commandJson);

      if (command.data.options) {
        const subcommands = command.data.options.filter(
          opt => opt.type === 1 || opt.type === 2
        );
        totalSubcommands += subcommands.length;
      }

      console.log(`✅ Registered slash: /${command.data.name}`);
    } catch (error) {
      console.error(`❌ Error registering ${command.data.name}:`, error.message);
    }
  }

  return { commands, totalSubcommands };
}
