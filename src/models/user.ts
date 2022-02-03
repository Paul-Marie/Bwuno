import * as mongoose from 'mongoose';

// Discord' server model
const userSchema = new mongoose.Schema({
  identifier:     { type: String, required: true, unique: true  },
  lang:           { type: Number, required: true, default: 0    },
  server_id:      { type: Number, required: true, default: 2    },
  subscriptions:  { type: Array,  required: true, default: []   }
});

export default mongoose.model("User", userSchema);
