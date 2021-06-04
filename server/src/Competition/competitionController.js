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

const create_competition = async (req, res) => {

    try {
      const competition = await Competition.create(req.body);
      
      res.status(201).json({
        Success: true,
        message: "Competition created successfully",
         data: competition,

      })

    } catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({
        Success: false,
         message: "Failed to create competition",
         errors: errors
     })
    }
}
const get_all_competitions = async (req, res) => {
    try {
      const competitions = await Competition.find().sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        numberOfRecords: competitions.length,
        data: { competitions },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        errors: { message: error.message },
      });
    }
  };
  const get_competition_by_id = async (req, res) => {
    try {
      const competition = await Competition.findById(req.params.id);
  
      if (!competition) throw Error("Not found");
  
      res.status(200).json({
        success: true,
        data: { competition },
      });
    } catch (error) {
      if (error.kind === "ObjectId" || error.message === "Not found") {
        res.status(404).json({
          success: false,
          errors: { message: "Competition not found" },
        });
      } else {
        res.status(500).json({
          success: false,
          errors: { message: error.message },
        });
      }
    }
}
const delete_competition = async (req, res) => {
    try {
      const competition = await Competition.findByIdAndDelete(req.params.id);
  
      if (!competition) throw Error("Not found");

      res.status(200).json({
        Success: true,
        message: "competition deleted successfully",
      });
    } catch (error) {
        if (error.kind === "ObjectId" || error.message === "Not found") {
          res.status(404).json({
            success: false,
            errors: { message: "Competition not found" },
          });
        } else {
          res.status(500).json({
            success: false,
            errors: { message: error.message },
          });
        }
      }
    
        

       
  }

module.exports = {
    create_competition,
    get_all_competitions,
    get_competition_by_id,
    delete_competition

  }