const express = require('express');
const {spawn} = require('child_process');
const bodyParser = require('body-parser');
const multer = require("multer");
const http = require("http");
const fs = require("fs");
const path = require("path");

const app = express()
const port = 3000
//app.use(cors())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
 
  const handleError = (err, res) => {
    res
      .status(500)
      .contentType("text/plain")
      .end("Oops! Something went wrong!");
  };
  
  const upload = multer({
    dest: "/potato"
  });

  app.post('/upload', upload.single("image"),
  (req, res) => {
    // Handle the post for this route
    // Redirect upload to flask server
    // Return response from flask server with status
    console.log("recieved post request");
        const tempPath = req.file.path;
        const targetPath = path.join(__dirname, "./uploads/image.jpg");
    
        if (path.extname(req.file.originalname).toLowerCase() === ".jpg") {
          fs.rename(tempPath, targetPath, err => {
            if (err) {
              return handleError(err, res);
            }

    
            res
              .status(200)
              .contentType("text/plain")
              .end("File uploaded!");
          });
        } else {
          fs.unlink(tempPath, err => {
            if (err) return handleError(err, res);
    
            res
              .status(403)
              .contentType("text/plain")
              .end("Only .jpg files are allowed!");
          });
        }
   });

//   var corsOptions = {
//     origin: 'http://example.com',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }
  
//   app.get('/products/:id', cors(corsOptions), function (req, res, next) {
//     res.json({msg: 'This is CORS-enabled for only example.com.'})
//   })

app.get('/', (req, res) => {

    console.log("hello world")
})
app.get("/image.jpg", (req, res) => {
    res.sendFile(path.join(__dirname, "./uploads/image.jpg"));
  });

app.listen(port, () => console.log(`Example app listening on port 
${port}!`))

