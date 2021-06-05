const mongoose = require('mongoose');
const { isDate } = require("validator");
const refIsValid = require('../middleware/refIsValid');
const User = require('../User/User')
const Schema = mongoose.Schema;

const competitionSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name of competition is required"],
  },
  sponsor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "Sponsor is required"],
  },
  startDate: {
      type: Date,
      required: [true, "Start date of competition is required"],
      validate: [isDate, "The entered date should be a valid date"],
      min: [Date.now, "The start date of the competition can't be in the past"]

  },
  endDate: {
    type: Date,
    required: [true, "End date of competition is required"],
    validate: [isDate, "The entered date should be a valid date"],
    min: [Date.now, "The end date of the competition can't be in the past"]
    

  },
 competitors: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  prizes: [
    {
      type: String,
      
    },
  ],
  winner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
},


}, { timestamps: true });

competitionSchema.path('sponsor').validate((value, respond) => {
    return refIsValid(value, respond, User);
}, 'Invalid sponsor.');

competitionSchema.path('winner').validate((value, respond) => {
    return refIsValid(value, respond, User);
}, 'Invalid winner.');

competitionSchema.path('competitors').validate((value, respond) => {
  return refIsValid(value[value.length-1], respond, User);
}, 'Invalid competitor.');



const Competition = mongoose.model('Competition', competitionSchema);

module.exports = Competition;