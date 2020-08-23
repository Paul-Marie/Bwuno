import * as mongoose from 'mongoose';
import * as config from "../resources/config.json";
import bot from "./discord";

const databaseURL = process.env.MONGODB_URI || 'mongodb://localhost/bruno';

async function run(): Promise<void> {
    try {
        await mongoose.connect(databaseURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }

    console.log(`Connected to database at ${databaseURL}`);
    try {
        if (process.argv.length === 3) {
            let script: any = await import(`${process.argv[2]}`)
            script.default();
        } else
            bot.login(config.discord.token);
    } catch (err) {
        console.error(err)
        process.exit(1);
    }
}

run();
