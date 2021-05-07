const { Schema, model } = require('mongoose');

const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 30,
    },
    description: { type: String },
    type: { type: String, enum: ['public', 'private'], default: 'public' },
    members: { type: [Schema.Types.ObjectId], ref: 'User' },
  },
  {
    timestamps: true,
  }
);

const Group = model('Group', groupSchema);

module.exports = Group;
