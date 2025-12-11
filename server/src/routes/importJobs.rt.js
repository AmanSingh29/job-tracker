const express = require("express");
const { asyncHandler } = require("../middlewares/asyncHandler.mw");
const sendResponseMw = require("../middlewares/sendResponse.mw.js");
const { runImport } = require("../controllers/importJobs.ct.js");
const router = express.Router();

router.route("/").post(asyncHandler(runImport), sendResponseMw);

module.exports = router;
