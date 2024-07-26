module.exports = (mongoose) => {
  const bcrypt = require("bcryptjs");

  const ProfilePicSchema = mongoose.Schema({
    url: { type: String, reqired: true },
    key: { type: String, reqired: true },
    uploadedAt: { type: Date, default: Date.now },
  });

  const ShortReelSchema = mongoose.Schema({
    url: { type: String, reqired: true },
    key: { type: String, reqired: true },
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
      personalInfoSubmitted: { type: Boolean, default: false },
      professionalInfoSubmitted: { type: Boolean, default: false },
      purposeSubmitted: { type: Boolean, default: false },
      age: { type: Number },
      dateOfBirth: { type: Date },
      gender: { type: String },
      location: { type: String },
      hobbies: [{ label: String, value: String }],
      interests: [{ label: String, value: String }],
      smokingHabits: { type: String },
      drinkingHabits: { type: String },
      qualification: [{ label: String, value: String }],
      profilePic: [ProfilePicSchema],
      shortReel: ShortReelSchema,
      professionType: { type: String },
      companyName: { type: String },
      designation: { type: String },
      jobLocation: { type: String },
      expertiseLevel: { type: String },
      purpose: { type: String },
      fake: { type: Boolean },
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
