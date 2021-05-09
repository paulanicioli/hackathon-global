const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide a username.'],
      unique: true,
      minlength: [3, 'Your username must have three characters or more'],
      maxlength: [30, 'Your username cannot have more than 30 characters.'],
    },
    email: {
      type: String,
      required: [true, 'Please provide a valid email.'],
      unique: true,
    },
    password: { type: String, required: true, min: 8 },
    birthDate: { type: Date },
    profilePicture: {
      type: String,
    },
    active: { type: Boolean, default: true },
    groups: { type: [Schema.Types.ObjectId], ref: 'Group' },
    gender: {
      type: String,
      enum: ['male', 'female', 'non-binary'],
    },
    language: { type: String, enum: ['en', 'es', 'pt', 'de', 'fr'] },
  },
  {
    timestamps: true,
  }
);

const User = model('User', userSchema);

module.exports = User;
