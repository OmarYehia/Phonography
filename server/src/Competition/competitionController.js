const Competition = require('./Competition');


const competion_create_post = async (req,res) => {
  const competition = new Competition(req.body);
  competition.save()
    .then(result => {
      res.json({data: competition})
    })
    .catch(err => {
      console.log(err);
    });

}

module.exports = {
    competion_create_post
  }