const express= require("express");
const app= express();
const dotenv= require("dotenv");
dotenv.config();
const path=require("path");

const cors=require("cors");

// very important point by this command below we are able to send json
// documents to the page before that it was not possible to send data in 
// json format 
app.use(express.json());
app.use("/images", express.static(path.join(__dirname,"/images")));
//app.use(cors({
//    origin:["https://abhijit-mern-blog-app.netlify.app","http://localhost:3000"],
//}));

app.options('*',cors());

var headerSettings = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'example.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(headerSettings);

const authRoute=require("./routes/auth");
const usersRoute= require("./routes/users");
const postRoute= require("./routes/posts");
const catRoute= require("./routes/categories");
const multer=require("multer");

const mongoose=require("mongoose");
mongoose.connect(process.env.MONGO_URL).
then(()=>{console.log(("MongoDB connected!"))}).
catch((err)=>console.log(err));


// app.use("/", (req,res)=>{
//     console.log("Hey, this is main url!");
// })

const storage = multer.diskStorage({
    destination:(req, file, cb) =>{
        cb(null, "images")
    }, filename:(req,file, cb)=>{
        cb(null,req.body.name);
    },
});

const upload= multer({storage:storage});
app.post("/api/upload", upload.single("file"), (req,res)=>{
    res.status(200).json("File has been uploaded!");
});

app.use("/api/auth",authRoute);
app.use("/api/users", usersRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", catRoute);

app.listen(5000, ()=>{
    console.log("Backend is running!");
});
