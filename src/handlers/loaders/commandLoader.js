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

          // Register aliases
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
 * Register all commands (wrapper function for clarity)
 * @param {Client} client - Discord.js client
 */
export async function registerCommands(client) {
  console.log('🔄 Starting command registration...');
  await loadCommands(client);
  console.log('✅ Command registration complete!');
}
