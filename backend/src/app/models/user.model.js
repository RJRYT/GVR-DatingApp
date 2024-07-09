module.exports = (mongoose) => {
  const bcrypt = require("bcryptjs");
  const UserSchema = mongoose.Schema(
    {
      username: { type: String, unique: true, sparse: true },
      email: { type: String, unique: true, sparse: true },
      password: { type: String },
      googleId: { type: String, unique: true, sparse: true },
      phoneNumber: { type: String, unique: true, sparse: true },
      date: { type: Date, default: Date.now },
    },
    { timestamps: true }
  );

  // Ensure sparse indexes on fields that may not be set for every user
  UserSchema.index({ username: 1 }, { unique: true, sparse: true });
  UserSchema.index({ email: 1 }, { unique: true, sparse: true });
  UserSchema.index({ googleId: 1 }, { unique: true, sparse: true });
  UserSchema.index({ phoneNumber: 1 }, { unique: true, sparse: true });

  UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

  UserSchema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  return mongoose.model("User", UserSchema);
};
