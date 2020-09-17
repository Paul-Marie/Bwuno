import * as mongoose from 'mongoose';

// Discord' server model
const serverSchema = new mongoose.Schema({
    identifier: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    lang: { type: Number, required: true, default: 0 },
    server_id: { type: Number, required: true, default: 2 },
    prefix: { type: String, required: true, default: "!bruno " },
    auto_mode: { type: Boolean, required: true, default: false },
    auto_channel: { type: String },
});

export default mongoose.model("Server", serverSchema);
