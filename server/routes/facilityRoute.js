const express = require("express");
const router = express.Router();
const facilityController = require("../controllers/facilityController");

router.post("/facility/add", facilityController.addFacility);
router.get("/facility/all", facilityController.getAllFacilities);
router.delete("/facility/:id", facilityController.deleteFacility);

module.exports = router;
