const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://saleshandy_123:${password}@cluster0.m3k1r.mongodb.net/covidRecords?retryWrites=true&w=majority`;
mongoose.connect(url);

const userSchema = new mongoose.Schema({
  name: String,
  aadhaar: String,
  createdDate: Date,
  vaccinated: Boolean,
  state: String,
  ip: String,
});


module.exportss = mongoose.model("User", userSchema);

// const user = new User({
//   name: "abc mongo",
//   aadhaar: "586758695768",
//   vaccinated: true,
//   state: "MP",
// });

// user.save().then((result) => {
//   console.log("user saved!");
// });
