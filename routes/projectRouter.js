const express = require("express");
const Controller = require("../Controller/projectController");
const route = express.Router();

route.get("/", Controller.getProjects);
route.post("/", Controller.postProject);

module.exports = route;
