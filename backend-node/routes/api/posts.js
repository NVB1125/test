var mongoose = require("mongoose");
var router = require("express").Router();
var auth = require("../auth");
const multer = require("multer");
const path = require("path");
var Post = mongoose.model("Post");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

const fs = require("fs");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage });

router.post("/new-post", upload.array("file[]", 12), function (req, res, next) {
    console.log("reqUpload", req.files)
    const { files } = req;
  
    if (!files) {
      res.status(400).json({
        status: "failure",
        message: "please upload a file",
      });
      return;
    }
    res.status(200).json({
        status: "success",
        message: "uploadLogo success",
    })
});

router.post("/new-post-data", auth.required, function (req, res, next) {
  console.log("new-post-data: ", req.payload)
  let post = new Post()
  post.userid = req.payload._id
  post.description = req.body.description
  post.count = req.body.count
  post.save().then((post) => {
    return res.json({
      post
    });
  })
});

router.get("/get-post", auth.required, function (req, res, next) {
  console.log("get-post: ", req.payload)
  Post.find({}).then(posts => {
    let files = []
    posts.forEach((element, i) => {
      console.log("dd", element)
      if (fs.existsSync('public/' + element._id + '.jpg')) {
        console.log("jpg")
        files[i] = fs.readFileSync('public/' + element._id + ".jpg");
      } else if (fs.existsSync('public/' + element._id + '.png')) {
        console.log("png exist")
        files[i] = fs.readFileSync('public/' + element._id + ".png")
      } else if (fs.existsSync('public/' + element._id + '.jpeg')) {
        console.log("jpeg")
        files[i] = fs.readFileSync('public/' + element._id + ".jpeg");
      }
    });
    return res.json({
      posts,
      files
    });
  })
});

router.get("/get-post-detail/:_id", auth.required, function (req, res, next) {
  console.log("get-post-detail: ", req.payload)
  Post.findOne({_id: req.params._id}).then(post => {
    console.log("postDetail: ", post)
    let files = []
    if (fs.existsSync('public/' + post._id + '.jpg')) {
      console.log("jpg")
      files[0] = fs.readFileSync('public/' + post._id + ".jpg");
    } else if (fs.existsSync('public/' + post._id + '.png')) {
      console.log("png exist")
      files[0] = fs.readFileSync('public/' + post._id + ".png")
    } else if (fs.existsSync('public/' + post._id + '.jpeg')) {
      console.log("jpeg")
      files[0] = fs.readFileSync('public/' + post._id + ".jpeg");
    }
    for (let i = 1 ; i < post.count ; i++) {
      if (fs.existsSync('public/' + post._id + '-' + i + '.jpg')) {
        console.log("jpg")
        files[i] = fs.readFileSync('public/' + post._id + '-' + i + ".jpg");
      } else if (fs.existsSync('public/' + post._id + '-' + i + '.png')) {
        console.log("png exist")
        files[i] = fs.readFileSync('public/' + post._id + '-' + i + ".png")
      } else if (fs.existsSync('public/' + post._id + '-' + i + '.jpeg')) {
        console.log("jpeg")
        files[i] = fs.readFileSync('public/' + post._id + '-' + i + ".jpeg");
      }
    }
    return res.json({
      post,
      files
    });
  })
});

router.post("/add-comment", auth.required, function (req, res, next) {
  console.log("add-comment: ", req.payload)
  Post.findById({_id: req.body.postid}).populate('userid').then(post => {
    console.log("post: ", post)
    let comments = post.comments
    comments.push({
      comment: req.body.comment,
      userid: req.payload._id,
      username: req.payload.username,
      created_time: Date.now()
    })
    Post.findByIdAndUpdate({_id: req.body.postid}, {
      comments
    }).then(data => {
      if (post.userid.email != req.payload.email) {
        var mailOptions = {
          to: post.userid.email,
          from: {
            email: "elias@holamicasa.com",
            name: 'Elias'
          },
          subject: "Recieved comment",
          text: "Received comment - '" + req.body.comment + "' from " + req.payload.username + "\n\n" + 
                "You can check at this link\n\n" + 
                "http://3.14.248.227/detail/" + post._id,
        };
        sgMail.send(mailOptions, function (error, info) {
          if (error) {
            return res.status(500).send({
              error: {
                message: "Something went wrong",
              },
            });
          }
          console.log("sent")
        });
      }
      return res.json({
        data
      })
    })
  })
});

module.exports = router;