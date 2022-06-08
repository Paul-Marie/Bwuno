import * as mongoose from 'mongoose';

// Channel's model used topost RSS flows
const channelSchema = new mongoose.Schema({
  guild:   { type: String, required: true },
  channel: { type: String, required: true },
  type:    { type: String, required: true }
});

export default mongoose.model("Channel", channelSchema);