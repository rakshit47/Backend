require("dotenv").config();

const { json } = require("body-parser");
const express = require("express");
const { ObjectId } = require("mongodb");
const MongoClient = require("mongodb").MongoClient;
const app = express();

app.use(express.json());

app.listen(8000, (req, res) => {
  console.log("Server Started...");
});

const client = new MongoClient(process.env.DATA_URL);

const base_url = "/api/v3/app";

client.connect((err) => {
  //Connecting to Database
  const coll = client.db("base").collection("data");
  console.log("DB Connected");

  //Getting events by their id and Pagination as well
  app.get(base_url + "/events", async (req, res) => {
    try {
      if(req.query.id){
        let data = await coll.findOne({ _id: ObjectId(req.query.id) });
        if(data == null) throw err;
        res.send(data);
      }
      if(req.query.type || req.query.limit || req.query.page){
        let page = req.query.page || 1;
        let lim = parseInt(req.query.limit) || 2;
        let type = {
          latest : -1,
          normal : 1
        } ;
        let data = [];
        await coll.find().sort({ _id : type[`${req.query.type}`] || 1}).skip(page * lim).limit(lim).forEach(ele => data.push(ele)).then(()=>{
          res.status(200).json(data);
        })
      }
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  });

  //Creating new Events
  app.post(base_url+"/events", async (req, res) => {
    try {
      let data = await coll.insertOne(req.body);
      // data.schedule = new Date();
      res.send(data);
    } catch (err) {
      res.status(403).json({ message: err.message });
    }
  });

  //Update by id
  app.put(base_url+'/events/:id',getEvent,async (req,res)=>{
    try {
      let data = await coll.updateOne({_id: ObjectId(req.params.id)},{ $set: req.body});
      if(data == null) throw err;
      res.status(201).json({message : 'Event Updated Id : '+req.params.id});
    } catch (err) {
      res.status(404).json({message : err.message});
    }
  })
  
  //Delete by id
  app.delete(base_url+'/events/:id',getEvent,async (req,res)=>{
    try {
      let data = await coll.deleteOne({_id: ObjectId(req.params.id)});
      if(data == null) throw err;
      res.status(200).json({message : "Event Deleted Id : "+ req.params.id})
    } catch (err) {
      res.status(404).json({message : err.message});
    }
  })

  //Middleware Function for checking event existance
  async function getEvent(req, res, next) {
    let event;
    try {
      let event = await coll.findOne({ _id: ObjectId(req.params.id) });
      if(event == null) throw err;
      // res.send(data);
      res.event = event;
      next();
    } catch (err) {
      res.status(404).json({ message: "Event not exists" });
    }
  }
});
