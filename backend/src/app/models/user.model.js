module.exports = (mongoose) => {
  const bcrypt = require("bcryptjs");

  const ProfilePicSchema = mongoose.Schema({
    url: { type: String, reqired: true },
    uploadedAt: { type: Date, default: Date.now },
  });

  const ShortReelSchema = mongoose.Schema({
    url: { type: String, reqired: true },
    uploadedAt: { type: Date, default: Date.now },
  });
  
  const UserSchema = mongoose.Schema(
    {
      firstName: { type: String },
      middleName: { type: String },
      lastName: { type: String },
      username: { type: String, unique: true, sparse: true },
      email: { type: String, unique: true, sparse: true },
      password: { type: String },
      googleId: { type: String, unique: true, sparse: true },
      phoneNumber: { type: String, unique: true, sparse: true },
      date: { type: Date, default: Date.now },
      numberVerified: { type: Boolean, default: false },
      emailVerified: { type: Boolean, default: false },
      profileSectionOneDone: { type: Boolean, default: false },
      profileSectionTwoDone: { type: Boolean, default: false },
      profileSectionThreeDone: { type: Boolean, default: false },
      age: { type: Number },
      dateOfBirth: { type: Date },
      Hobbies: { type: Array },
      interests: { type: Array },
      smoking: { type: String },
      drinking: { type: String },
      qualification: { type: String },
      profilePic: [ProfilePicSchema],
      shortReel: ShortReelSchema,
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
