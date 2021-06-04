const Competition = require('./Competition');

const handleErrors = (err) => {
    let errors = {
      name: "",
      sponsor: "",
      startDate: "",
      endDate: "",
      competitors:"",
      winner:"",
    };
    // Validation errors
    if (err.message.includes("Competition validation failed")) {
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
  };

const competion_create_post = async (req,res) => {
  const competition = new Competition(req.body);
  competition.save()
    .then(result => {
      res.status(201).json({
          "Success": true,
          "message": "Competition created successfully",
          "data": competition,

        })
    })
    .catch(err => {
        const errors = handleErrors(err);
        res.status(400).json({
           "Success": false,
            "message": "Failed to create competition",
            "errors": errors
        })
    });

}

module.exports = {
    competion_create_post
  }