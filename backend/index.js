const express = require('express')
const {spawn} = require('child_process');
//var cors = require('cors')
const bodyParser = require('body-parser');
const multer = require("multer");
const http = require("http");
const fs = require("fs");
const path = require("path");

const app = express()
const port = 3000



//app.use(cors())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200/"); // update to match the domain you will make the request from
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
    dest: "/potato/"
  });

  app.post('/', upload.single( /* name attribute of <file> element in your form */),
  (req, res) => {
    // Handle the post for this route
    console.log("recieved post request");
        const tempPath = req.file.path;
        const targetPath = path.join(__dirname, "./uploads/image.jpg");
    
        if (path.extname(req.file.originalname).toLowerCase() === ".jpg") {
          fs.rename(tempPath, targetPath, err => {
            if (err) return handleError(err, res);
    
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

 var dataToSend;
 // spawn new child process to call the python script
 const python = spawn('python', ['testscript.py']);
 // collect data from script
 python.stdout.on('data', function (data) {
  console.log('Pipe data from python script ...');
  dataToSend = data.toString();
 });
 // in close event we are sure that stream from child process is closed
 python.on('close', (code) => {
 console.log(`child process close all stdio with code ${code}`);
 // send data to browser
 res.send(dataToSend)
 });

})
app.get("/image.jpg", (req, res) => {
    res.sendFile(path.join(__dirname, "./uploads/image.jpg"));
  });

app.listen(port, () => console.log(`Example app listening on port 
${port}!`))

