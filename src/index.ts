import { environment } from "./enviroment";
import { Telegraf } from "telegraf";

(async () => {
  console.log("==== START BOT ===");
  const bot = new Telegraf(environment.token);
})();
