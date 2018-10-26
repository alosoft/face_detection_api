const mongoose = require('mongoose');


const databaseSchema = new mongoose.Schema({
  user_id: Number,
  name: String,
  email: String,
  // password: String,
  entries: Number,
  joined: String,
  id: {
    type: mongoose.Schema.Types.ObjectId,
  },
});


module.exports = mongoose.model("Database", databaseSchema);