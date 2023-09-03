const sendResponse = require("../Helper/Helper");
const ProjectModel = require("../models/ProjectModel");

const Controller = {
  getProjects: async (req, res) => {
    try {
      let { page, limit, sort, asc } = req.query;
      if (!page) page = 1;
      if (!limit) limit = 10;

      const skip = (page - 1) * limit;
      const result = await ProjectModel.find()
        .sort({ [sort]: asc })
        .skip(skip)
        .limit(limit);
      if (!result) {
        res.send(sendResponse(false, null, "No Data Found")).status(404);
      } else {
        res
          .send(sendResponse(true, result, "Data Found", "", page, limit))
          .status(200);
      }
    } catch (e) {
      console.log(e);
      res.send(sendResponse(false, null, "Server Internal Error")).status(400);
    }
  },
  postProject: async (req, res) => {
    let { name, description, startDate, endDate, creatorUserID } = req.body;
    try {
      let errArr = [];

      //validation Part
      if (!name) {
        errArr.push("Required name");
      }
      if (!description) {
        errArr.push("Required description");
      }
      if (!startDate) {
        errArr.push("Required startDate");
      }

      if (!endDate) {
        errArr.push("Required endDate");
      }
      if (!creatorUserID) {
        errArr.push("Required creatorUserID");
      }
      if (errArr.length > 0) {
        res
          .send(sendResponse(false, errArr, null, "Required All Fields"))
          .status(400);
        return;
      } else {
        let obj = { name, description, startDate, endDate, creatorUserID };
        let Course = new ProjectModel(obj);
        await Course.save();
        if (!Course) {
          res.send(sendResponse(false, null, "Data Not Found")).status(404);
        } else {
          res.send(sendResponse(true, Course, "Save Successfully")).status(200);
        }
      }
    } catch (e) {
      console.log(e);
      res.send(sendResponse(false, null, "Internal Server Error")).status(400);
    }
  },
};

module.exports = Controller;
