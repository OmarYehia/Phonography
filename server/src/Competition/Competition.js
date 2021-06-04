const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const competitionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  sponsor: {
    type: Schema.Types.ObjectId, ref: 'User',
    required: true,
  },
  startDate: {
      type: Date,
      

  },
  endDate: {
    type: Date,
    

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
    type: Schema.Types.ObjectId, ref: 'User',
},


}, { timestamps: true });

const Competition = mongoose.model('Competition', competitionSchema);

module.exports = Competition;