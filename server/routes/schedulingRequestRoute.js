const express = require("express");
const router = express.Router();
const schedulingRequestController = require("../controllers/schedulingRequestController");

router.post("/schedule-request/add", schedulingRequestController.addSchedulingRequest);
router.put("/schedule-request/update", schedulingRequestController.handleSchedulingRequest);
router.get("/schedule-request/all", schedulingRequestController.getAllSchedulingRequests);
router.get("/schedule-request/get/:id", schedulingRequestController.getSchedulingRequestById);
router.delete("/schedule-request/delete/:id", schedulingRequestController.deleteSchedulingRequestById);

module.exports = router;
