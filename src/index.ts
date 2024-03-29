import * as mongoose from 'mongoose';
import * as config from "../resources/config.json";
import { bot } from "./discord";

// Start MongoDB's database and import a file if launched with a third argument
(async () => {
  try {
    await mongoose.connect(config.mongo.url);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Connected to database at ${config.mongo.url}`);
  try {
    if (process.argv.length !== 2) {
      const script: any = await import(`./scripts/${process.argv[2]}`);
      script.default();
    } else {
      await bot.login(config.discord.token);
      await import("./server");
    }
  } catch (err) {
    console.error(err)
    process.exit(1);
  }
})();
