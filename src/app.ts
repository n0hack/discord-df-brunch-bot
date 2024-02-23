import { Client, GatewayIntentBits, IntentsBitField } from 'discord.js';
import 'dotenv/config';
import * as Event from './events';

const initialize = async () => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMembers,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.MessageContent,
    ],
  });

  client.on('ready', Event.initialize);
  client.once('ready', Event.notifyTodayGrade);
  client.on('guildMemberAdd', Event.greetingToNewMember);
  client.on('messageCreate', Event.testMessage);

  await client.login(process.env.DISCORD_TOKEN);
};

initialize();
