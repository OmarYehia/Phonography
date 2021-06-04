const { Router } = require("express");
const competionController = require("../Competition/competitionController");

const router = Router();

router.post("/competition", competionController.competion_create_post);


module.exports = router;
