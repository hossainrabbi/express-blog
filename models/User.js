const { model, Schema } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: [true, 'email is must be unique!'],
  },
  role: {
    type: String,
    default: 'user',
    enum: ['admin', 'user'],
  },
  password: {
    type: String,
    required: [true, 'password is required'],
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePasswordMatch = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = model('User', userSchema);
