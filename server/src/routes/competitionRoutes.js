const { Router } = require("express");
const competionController = require("../Competition/competitionController");
const { requireAuth, grantAccess } = require("../middleware/authMiddleware");

const router = Router();

//Crud operations on competition

router.post("/competition", competionController.create_competition);
router.get("/competition", competionController.get_all_competitions);
router.get("/competition/:id", competionController.get_competition_by_id);
router.delete("/competition/:id", competionController.delete_competition);
router.put("/competition/:id", competionController.update_competition);

//operations on competitors(join - get all - remove)
router.put("/competition/:id/competitor/join", requireAuth, competionController.join_competitor_into_competition);
router.get("/competition/:id/competitors",competionController.get_all_competitors_of_competition);
router.put("/competition/:id/competitor/remove",requireAuth,competionController.remove_competitor_from_competition);

//assign winner to competition
router.put("/competition/assign-winner/:id", competionController.assign_winner_of_competition);

//add prizes to competition
router.put("/competition/add-prizes/:id",competionController.add_prizes_for_competition);




module.exports = router;
