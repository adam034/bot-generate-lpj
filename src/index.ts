import { environment } from "./enviroment.js";
import { Telegraf } from "telegraf";
import { App } from "./app.js";
import { InitGoogleSheet } from "./integrations/google-sheet/client.js";

(async () => {
  console.log("==== START BOT ===");

  await InitGoogleSheet(
    environment.sheet_id,
    environment.client_email,
    environment.private_key,
  );
  const bot = new Telegraf(environment.token);
  const start = await App(bot);
  start.launch();
})();
