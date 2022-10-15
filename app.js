const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-mehul:Test123@cluster0.fw3y8.mongodb.net/Scaler?retryWrites=true&w=majority", {useNewUrlParser: true});

const interviewSchema = {
  interviewer: String,
  candidate: String,
  start: String,
  end: String
};

const Interview = mongoose.model("Interview", interviewSchema);

app.get("/", function(req, res) {
  Interview.find({}, function(err, interviews) {
    res.render("home", {homeContent: homeStartingContent, allPosts: interviews});
  });
})

app.get("/about", function(req, res) {
  res.render("about", {AContent: aboutContent});
})

app.get("/contact", function(req, res) {
  res.render("contact", {CContent: contactContent});
})

app.get("/interviews/:UID", function(req, res) {
  const postId = req.params.UID;
  Interview.findOne({_id: postId}, function(err, post) {
    res.render("edit", {uid: postId, interviewer: post.interviewer, candidate: post.candidate, start: post.start, end: post.end});
  })
})

app.get("/schedule", function(req, res) {
  res.render("schedule");
})

app.post("/schedule", function(req, res) {
  const post = new Interview ({
    interviewer: req.body.Interviewer,
    candidate: req.body.Candidate,
    start: req.body.Start,
    end: req.body.End
  });
  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
})

app.post("/interviews/:UID", function(req, res) {
  const val = new Interview ({
    _id: req.params.UID,
    interviewer: req.body.Interviewer,
    candidate: req.body.Candidate,
    start: req.body.Start,
    end: req.body.End
  });
  Interview.deleteOne({ _id: req.params.UID }).then(function(){
    console.log("Deleted"); // Success
 }).catch(function(error){
    console.log(error); // Failure
 });
 val.save();
 res.redirect("/");
})

app.listen(process.env.PORT)
