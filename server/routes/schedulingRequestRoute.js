const express = require("express");
const router = express.Router();
const schedulingRequestController = require("../controllers/schedulingRequestController");

router.post("/schedule-request/add", schedulingRequestController.addSchedulingRequest);
// router.get("/schedule-request/all", schedulingRequestController.getAllFacilities);
// router.delete("/schedule-request/:id", schedulingRequestController.deleteFacility);

module.exports = router;
