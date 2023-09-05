const express = require("express");
const Controller = require("../Controller/taskController");
const route = express.Router();

route.get("/", Controller.GetTasks);
route.post("/", Controller.PostTask);

module.exports = route;