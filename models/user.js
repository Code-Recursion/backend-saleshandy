const mongoose = require("mongoose");

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
  },
  createdDate: Date,
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

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("User", userSchema);
