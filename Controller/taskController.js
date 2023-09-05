const sendResponse = require("../Helper/Helper");
const TaskModel = require("../models/TaskModel");

const Controller = {
  GetTasks: async (req, res) => {
    try {
      let { page, limit, sort, asc } = req.query;
      if (!page) page = 1;
      if (!limit) limit = 10;

      const skip = (page - 1) * limit;
      const result = await TaskModel.find()
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
  PostTask: async (req, res) => {
    const {
      Title,
      Description,
      DueDate,
      Priority,
      Status,
      CreatorUserID,
      TeamMembers,
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
        };
        let Task = new TaskModel(obj);
        await Task.save();
        if (!Task) {
          res.send(sendResponse(false, null, "Data Not Found")).status(404);
        } else {
          res.send(sendResponse(true, Task, "Save Successfully")).status(200);
        }
      }
    } catch (e) {
      console.log(e);
      res.send(sendResponse(false, null, "Internal Server Error")).status(400);
    }
    res.send("Post single Student Data");
  },
};

module.exports = Controller;
