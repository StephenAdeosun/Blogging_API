const mongoose = require('mongoose');
const shortid = require ('shortid');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const UserModel = new Schema({
    _id: {
      type: String,
      default: shortid.generate
    },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },

});

UserModel.pre('save', async function(next) {
  user = this;
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
})

UserModel.methods.validatePassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
}

const User = mongoose.model('User', UserModel);
module.exports = User;



