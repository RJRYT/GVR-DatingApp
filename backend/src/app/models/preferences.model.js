module.exports = (mongoose) => {
  const PreferencesSchema = mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    AgeRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    Location: { type: String, required: true },
    Interests: { type: [String], default: [] },
    Hobbies: { type: [String], default: [] },
    Education: { type: [String], default: [] },
    Gender: { type: String, default: "" },
    Smoking: { type: String, default: "" },
    Drinking: { type: String, default: "" },
    fake: { type: Boolean },
  });
  return mongoose.model("Preferences", PreferencesSchema);
};
