const Competition = require('./Competition');
const User = require('../User/User');

const handleErrors = (err) => {
    let errors = {
      name: "",
      sponsor: "",
      startDate: "",
      endDate: "",
      competitors:"",
      prizes:"",
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
         data: { competition },

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
      const competitions = await Competition.find().populate("sponsor").populate("competitors").sort({ createdAt: -1 });      
  
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
      const competition = await Competition.findById(req.params.id).populate("sponsor").populate("competitors");
      const sponsor = await User.findById(competition.sponsor)
  
      if (!competition) throw Error("Not found");
  
      res.status(200).json({
        success: true,
        data: { competition }
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
const update_competition = async (req,res) => {
  const { name, sponsor, startDate, endDate, prizes} = req.body;
  try{
    const competition = await Competition.findByIdAndUpdate(
      req.params.id,
      { $set: { name, sponsor, startDate, endDate, prizes} },
      { new: true, runValidators: true }
    ).populate("sponsor").populate("competitors");
    
    if (!competition) throw Error("Not found");

    res.status(202).json({
      Success: true,
      data: { competition }
    });
  } catch (error) {
    if (error.kind === "ObjectId" || error.message === "Not found") {
      res.status(404).json({
        success: false,
        errors: { message: "competition not found" },
      });
    } else {
      res.status(500).json({
        success: false,
        errors: { message: error.message },
      });
    }

  }    
}


const join_competitor_into_competition = async (req,res) => {  
  try{
    let competition = await Competition.findById(req.params.id);

    if (!competition) throw Error("Not found");  

    if(competition.competitors.includes(req.decodedToken.userId)) throw Error("Already exists")

     competition = await Competition.findByIdAndUpdate(
       req.params.id,
      { $push: { competitors:  req.decodedToken.userId  } },
      { new: true, runValidators: true }
      ); 
    
    res.status(202).json({
      Success: true,
      data: { message: "Competitor joined competition successfully "}
    });
  } catch (error) {
      if (error.kind === "ObjectId" || error.message === "Not found") {
        res.status(404).json({
          success: false,
          errors: { message: "competition not found" },
        });
      
      } else if(error.message === "Already exists") {
          res.status(400).json({
            success: false,
            errors: { message: "This competitor already exists in this competition" },
          });
        
        } else {
            res.status(500).json({
              success: false,
              errors: { message: error.message },
            });  
          }    

    }
}
const get_all_competitors_of_competition = async (req,res) => {
    try {
      const competition = await Competition.findById(req.params.id).populate("competitors");
  
      if (!competition) throw Error("Not found");

      const competitors = competition.competitors;

  
      res.status(200).json({
        success: true,
        numberOfRecords: competitors.length,
        data: { competitors },
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

const remove_competitor_from_competition = async (req,res) => {
  try{
    let competition = await Competition.findById(req.params.id);

    if (!competition) throw Error("Not found"); 


    if(!(competition.competitors.includes(req.decodedToken.userId))) throw Error("competitor not found");

    competition = await Competition.findByIdAndUpdate(
      req.params.id,
      { $pull: { competitors:  req.decodedToken.userId  } },
      { new: true, runValidators: true }
      );

       
    
    res.status(202).json({
      Success: true,
      data: {message: "Competitor removed from competition successfully"}
    });
  } catch (error) {
    if (error.kind === "ObjectId" || error.message === "Not found") {
      res.status(404).json({
        success: false,
        errors: { message: "competition not found" },
      });
    
    } else if(error.message === "competitor not found") {
        res.status(400).json({
          success: false,
          errors: { message: "This competitor isnot joining this competition" },
        });
      
      } else {
          res.status(500).json({
            success: false,
            errors: { message: error.message },
          });  
        }    

  }


}
const assign_winner_of_competition = async (req,res) => {
  try{
    const competition = await Competition.findByIdAndUpdate(
      req.params.id,
      { $set: { winner: req.body.winner } },
      { new: true, runValidators: true }
    );
    
    if (!competition) throw Error("Not found");

    res.status(202).json({
      Success: true,
      data: { competition }
    });
  } catch (error) {
    if (error.kind === "ObjectId" || error.message === "Not found") {
      res.status(404).json({
        success: false,
        errors: { message: "competition not found" },
      });
    } else {
      res.status(500).json({
        success: false,
        errors: { message: error.message },
      });
    }

  }    
}

const add_prizes_for_competition = async (req,res) => {

  try{
    const competition = await Competition.findByIdAndUpdate(
      req.params.id,
      {$push: {prizes: req.body.prizes}},
      {new: true}
      );

    if(!competition) throw Error("Not Found");

    res.status(202).json({
      Success: true,
      data: { competition }
    });

  }catch(error){
    if(error.kind == "ObjectId" || error.message == "Not Found"){
      res.status(404).json({
        Success: false,
        errors: {message: "Competition not found"}
      });
    }else{
      res.status(500).json({
        Sucess: false,
        errors: { message: error.message }
      });
    }
  }
}

module.exports = {
    create_competition,
    get_all_competitions,
    get_competition_by_id,
    delete_competition,
    update_competition,
    join_competitor_into_competition,
    get_all_competitors_of_competition,
    remove_competitor_from_competition,
    assign_winner_of_competition,
    add_prizes_for_competition,

  }