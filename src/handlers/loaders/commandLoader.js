import { readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import commandAliases from '../../config/commands/commandAliases.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Load all commands from the commands directory and register them with aliases
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

          // Validate command structure
          if (!command.data || !command.data.name) {
            console.warn(`⚠️  Skipping ${file}: Missing data.name`);
            continue;
          }

          const commandName = command.data.name;

          // Register main command
          client.commands.set(commandName, command);
          console.log(`✅ Loaded command: ${commandName}`);

          // Register aliases for prefix commands
          const aliases = commandAliases[commandName] || [];
          if (Array.isArray(aliases)) {
            for (const alias of aliases) {
              client.commands.set(alias, command);
              console.log(`   └─ Alias: ${alias}`);
            }
          }
        } catch (error) {
          console.error(`❌ Error loading command ${file}:`, error.message);
        }
      }
    }

    console.log(`\n📊 Total commands + aliases registered: ${client.commands.size}`);
  } catch (error) {
    console.error('❌ Error loading commands directory:', error);
  }
}

/**
 * Register slash commands for Discord API
 * Filters commands with supportSlash: true and builds SlashCommandBuilder data
 * @param {Client} client - Discord.js client
 * @returns {Object} { commands: Array, totalSubcommands: number }
 */
export function registerCommands(client) {
  const commands = [];
  let totalSubcommands = 0;

  for (const [, command] of client.commands) {
    // Only include each command once (skip aliases)
    if (!command.data || !command.data.name) continue;
    
    // Check if this is the main command (not an alias)
    if (client.commands.get(command.data.name) !== command) continue;

    // Only register slash commands if supportSlash is true
    if (command.supportSlash === false) {
      console.log(`⏭️  Skipping slash registration for ${command.data.name} (prefix-only)`);
      continue;
    }

    try {
      // Build the slash command JSON
      const commandJson = command.data.toJSON ? command.data.toJSON() : command.data;
      commands.push(commandJson);

      // Count subcommands if they exist
      if (command.data.options) {
        const subcommands = command.data.options.filter(
          opt => opt.type === 1 || opt.type === 2 // SUBCOMMAND or SUBCOMMAND_GROUP
        );
        totalSubcommands += subcommands.length;
      }

      console.log(`✅ Registered slash command: /${command.data.name}`);
    } catch (error) {
      console.error(`❌ Error registering slash command ${command.data.name}:`, error.message);
    }
  }

  return { commands, totalSubcommands };
}
