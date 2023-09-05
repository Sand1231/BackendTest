const sendResponse = require("../Helper/Helper");
const ProjectModel = require("../models/ProjectModel");

const Controller = {
  getProjects: async (req, res) => {
    try {
      let { page, limit, sort, asc, userId } = req.query;
      // if (!page) page = 1;
      // if (!limit) limit = 10;

      const filter = {};
      if (userId) {
        filter.creatorUserID = userId;
      } else {
        // If userId is not provided, you can choose to return an empty result
        // or a different response as needed.
        res
          .send(sendResponse(true, [], "No Data Found", "", page, limit))
          .status(200);
        return; // Exit the function
      }
      const skip = (page - 1) * limit;
      const result = await ProjectModel.find(filter).sort({ [sort]: asc });
      // .skip(skip)
      // .limit(limit);
      if (!result || result.length === 0) {
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
    let { name, category, description, startDate, endDate, creatorUserID } =
      req.body;
    try {
      let errArr = [];

      //validation Part
      if (!name) {
        errArr.push("Required name");
      }
      if (!category) {
        errArr.push("Required category");
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
        let obj = {
          name,
          category,
          description,
          startDate,
          endDate,
          creatorUserID,
        };
        let Project = new ProjectModel(obj);
        await Project.save();
        if (!Project) {
          res.send(sendResponse(false, null, "Data Not Found")).status(404);
        } else {
          res
            .send(sendResponse(true, Project, "Save Successfully"))
            .status(200);
        }
      }
    } catch (e) {
      console.log(e);
      res.send(sendResponse(false, null, "Internal Server Error")).status(400);
    }
  },
  SearchCourse: async (req, res) => {
    let { searchKey, searchVal } = req.query;
    try {
      searchVal = searchVal.toLowerCase();
      let result = await ProjectModel.find({
        [searchKey]: { $regex: new RegExp(searchVal, "i") },
      });
      if (!result) {
        res.send(sendResponse(false, null, "No Data Found")).status(404);
      } else {
        res.send(sendResponse(true, result, "Data found")).status(200);
      }
    } catch (e) {
      res.send(sendResponse(false, null, "Server Error")).status(400);
    }
  },
};

module.exports = Controller;
