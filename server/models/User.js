const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    nickname: {
      type: String,
      required: [true, 'Please provide a nickname.'],
      unique: true,
      minlength: [3, 'Your nickname must have three characters or more'],
      maxlength: [30, 'Your nickname cannot have more than 30 characters.'],
    },
    email: { type: String, required: [true, 'Please provide a valid email.'], unique: true },
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
