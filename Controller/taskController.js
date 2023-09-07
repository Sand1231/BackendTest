const sendResponse = require("../Helper/Helper");
const TaskModel = require("../models/TaskModel");
const ProjectModel = require("../models/ProjectModel");
const Controller = {
  GetTasks: async (req, res) => {
    try {
      let { page, limit, sort, asc, DueDate, userId } = req.query;
      if (!page) page = 1;
      if (!limit) limit = 40;

      const skip = (page - 1) * limit;
      // Create a filter object based on the optional DueDate parameter

      const filter = {};
      if (DueDate) {
        filter.DueDate = DueDate;
      }

      if (userId) {
        // Assuming userId is provided as a string in the request query
        filter.TeamMembers = userId;
      }

      const result = await TaskModel.find(filter)
        .sort({ [sort]: asc })
        .skip(skip)
        .limit(limit)
        .populate("projectId")

      if (!result) {
        res.send(sendResponse(false, null, "No Data Found")).status(404);
      } else {
        res
          .send(sendResponse(true, result, "Data Found", "", page, limit))
          .status(200);
      }
    } catch (e) {
      console.log(e);
      res.send(sendResponse(false, null, "Server Internal Error")).status(500); // Changed status code to 500 for server error
    }
  },

  PostTask: async (req, res) => {
    const {
      Title,
      Description,
      DueDate,
      Priority,
      Status,
      CreatorUserID,
      TeamMembers,
      projectId,
    } = req.body;
    try {
      let errArr = [];

      //validation Part
      if (!Title) {
        errArr.push("Required Title");
      }
      if (!Description) {
        errArr.push("Required Description");
      }
      if (!DueDate) {
        errArr.push("Required DueDate");
      }
      if (!Priority) {
        errArr.push("Required Priority");
      }
      if (!Status) {
        errArr.push("Required Status");
      }
      if (!CreatorUserID) {
        errArr.push("Required CreatorUserID");
      }
      if (!projectId) {
        errArr.push("Required projectId");
      }
      if (!TeamMembers) {
        errArr.push("Required TeamMembers");
      }

      if (errArr.length > 0) {
        res
          .send(sendResponse(false, errArr, null, "Required All Fields"))
          .status(400);
        return;
      } else {
        let obj = {
          Title,
          Description,
          DueDate,
          Priority,
          Status,
          CreatorUserID,
          TeamMembers,
          projectId,
        };
        let Task = new TaskModel(obj);
        await Task.save();
        if (!Task) {
          res.send(sendResponse(false, null, "Data Not Found")).status(404);
        } else {
          await ProjectModel.findByIdAndUpdate(
            obj.projectId,
            { $push: { tasks: Task._id } },
            { new: true }
          );
          res.send(sendResponse(true, Task, "Save Successfully")).status(200);
        }
      }
    } catch (e) {
      console.log(e);
      res.send(sendResponse(false, null, "Internal Server Error")).status(400);
    }
  },
};

module.exports = Controller;
