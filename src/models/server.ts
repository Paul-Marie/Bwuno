import * as mongoose from 'mongoose';
import * as settings from "../../resources/config.json";

// Discord' server model
const serverSchema = new mongoose.Schema({
  identifier:   { type: String, required: true, unique: true                            },
  name:         { type: String, required: true                                          },
  lang:         { type: Number, required: true, default: 0                              },
  server_id:    { type: Number, required: true, default: 2                              },
  prefix:       { type: String, required: true, default: settings.bwuno.default_prefix  },
  auto_channel: { type: String                                                          },
  auto_mode:    { type: Boolean, required: true, default: false                         }
});

export default mongoose.model("Server", serverSchema);
