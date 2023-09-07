const sendResponse = require("../Helper/Helper");
const LabelModel = require("../models/LabelModel");

const Conrollers = {
    getLabels:async(req,res)=>{
        try {
            const result = await LabelModel.find();
         if(!result){
            res.send(sendResponse(false,null,"No Labels Added Yet")).status(404)
         }
         else{
             res.send(sendResponse(true,result,"Data Found"))
         }
        } catch (error) {
            console.log(error);
            res.send(sendResponse(false,null,"Internal Server Error")).status(400)
        }
    },
    portLabel:async(req,res)=>{
        try {
            
        } catch (error) {
            
        }
    }
}