module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        username: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: Number
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    return mongoose.model("user", schema);
  };