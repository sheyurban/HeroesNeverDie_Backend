const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    image: String,
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: mongoose.Types.ObjectId(),
    },
  },
  { timestamps: true }
);

UserSchema.methods.whoAmI = () => {
  var output = this.username
    ? "My name is " + this.username
    : "I dont have a name";
  console.log(output);
};

UserSchema.pre(
  "save",
  function (next) {
    var user = this;
    console.log("_________________________________________");

    console.log(
      "Pre-save: " + this.password + " change: " + this.isModified("password")
    );

    if (!user.isModified("password")) return next();

    bcrypt.hash(user.password, 10).then((hashedPassword) => {
      user.password = hashedPassword;
      next();
    });
  },
  function (err) {
    next(err);
  }
);

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

var User = mongoose.model("User", UserSchema);
module.exports = User;
