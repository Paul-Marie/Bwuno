import * as mongoose from 'mongoose';

const serverSchema = new mongoose.Schema({
    identifier: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    lang: { type: Number, required: true, default: 0 },
    server_id: { type: Number, required: true, default: 2 },
    auto_mode: { type: Boolean, required: true, default: false },
    prefix: { type: String, required: true, default: "!bruno " },
    default_channel: { type: String },
});

export default mongoose.model("Server", serverSchema);
