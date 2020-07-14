import * as mongoose from 'mongoose';
import bot from "./discord";

const databaseURL = process.env.MONGODB_URI || 'mongodb://localhost/ugram';

async function run() {
    try {
        await mongoose.connect(databaseURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Connected to database at ${databaseURL}`);
    try {
        bot.login("NjQyOTM1NDYzMDQ4NjQyNTcw.Xchc6g.Rp4_cHb9aXFBf4C_MIrPyZJBuqA");
    } catch (err) {
        console.error(err)
        process.exit(1);
    }
}

run();
