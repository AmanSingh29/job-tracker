const express = require("express");
const { asyncHandler } = require("../middlewares/asyncHandler.mw.js");
const sendResponseMw = require("../middlewares/sendResponse.mw.js");
const { getImportHistoryOfJobs } = require("../controllers/importLog.ct.js");
const router = express.Router();

router.route("/").get(asyncHandler(getImportHistoryOfJobs), sendResponseMw);

module.exports = router;
