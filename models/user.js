const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  aadhaar: {
    type: String,
    required: true,
    min: 12,
    max: 12,
    unique: true,
  },
  created: Date,
  vaccinated: {
    type: Boolean,
    required: true,
  },
  state: {
    type: String,
    required: true,
    length: 12,
  },
  ip: String,
});

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("User", userSchema);
