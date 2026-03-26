import Discord from "discord.js";
import { DAILY_MESSAGE_SEND_HOUR, isValidConfig } from "./src/lib/config.js";
import { init as initUserStore } from "./src/store/persistence/user";
import { init as initSessionStore } from "./src/store/persistence/session";
import { client } from "./src/discord/client.js";
import { handleVoiceStateUpdate } from "./src/handler/voiceState.js";
import { TOKEN } from "./src/lib/env.js";
import onReady from "./src/handler/onReady.js";
import scheduler from "./src/store/persistence/scheduler.js";

if (!isValidConfig())
  throw Error(
    "\n---\nInvalid configurations.\nPlease refer to `README.md` for instructions.\n---\n",
  );

const { Events } = Discord;

initUserStore();
initSessionStore();

scheduler();

client.on(Events.ClientReady, async () => {
  await onReady();
});

client.on(Events.VoiceStateUpdate, handleVoiceStateUpdate);

client.login(TOKEN);
