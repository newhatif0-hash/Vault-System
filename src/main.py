import discord
from discord.ext import commands
from src.translator import translate_to_arabic

bot = commands.Bot(command_prefix="/")

@bot.event
async def on_command_completion(ctx):
    """This runs after every command"""
    pass

# Override the send method for all responses
original_send = discord.abc.Messageable.send

async def translated_send(self, content=None, **kwargs):
    # Translate content if it's a string
    if content and isinstance(content, str):
        content = await translate_to_arabic(content)
    
    # Translate embed descriptions and titles
    if 'embed' in kwargs and kwargs['embed']:
        embed = kwargs['embed']
        if embed.title:
            embed.title = await translate_to_arabic(embed.title)
        if embed.description:
            embed.description = await translate_to_arabic(embed.description)
        
        # Translate field names and values
        for field in embed.fields:
            field.name = await translate_to_arabic(field.name)
            field.value = await translate_to_arabic(field.value)
    
    return await original_send(self, content=content, **kwargs)

discord.abc.Messageable.send = translated_send

# Rest of your bot code...
