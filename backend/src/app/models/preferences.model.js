module.exports = (mongoose) => {
  const PreferencesSchema = mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    preferredAgeRange: { min: Number, max: Number },
    preferredLocation: String,
    preferredInterests: [String],
    preferredGender: String,
    fake: Boolean,
  });
  return mongoose.model("Preferences", PreferencesSchema);
};
