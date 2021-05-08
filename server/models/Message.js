const { Schema, model } = require('mongoose');

const messageSchema = new Schema(
  {
    title: {
      type: String,
      minlength: 3,
      maxlength: 30,
    },
    content: { type: String },
    language: { type: String, enum: ['en', 'es', 'pt', 'de', 'fr'] },
    group: { type: Schema.Types.ObjectId, ref: 'Group' },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

const Message = model('Message', messageSchema);

module.exports = Message;
