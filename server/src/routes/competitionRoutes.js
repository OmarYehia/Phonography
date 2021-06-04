const { Router } = require("express");
const competionController = require("../Competition/competitionController");

const router = Router();

router.post("/competition", competionController.create_competition);
router.get("/competition", competionController.get_all_competitions);
router.get("/competition/:id", competionController.get_competition_by_id);
router.delete("/competition/:id", competionController.delete_competition);



module.exports = router;
