const express = require("express");
const app = express();
const session = require("express-session");
// const cookieParser = require("cookie-parser");

// app.use(cookieParser("secretcode"));
// // sending signed cookies 
// app.get("/getsignedCookies", (req, res) => {
//     res.cookie("greet" , "hello", {signed :ture});
//     res.send("Hi, I am signed");
//   });
// // sending cookies 
// app.get("/getCookies", (req, res) => {
//     res.cookie("greet" , "hello");
//     res.send("Hi,add cooies");
//   });
// //verify cookies
// app.get("/verify", (req, res) => {
//     console.log(req.signedCookies);
//     res.send("Hi, I am root");
//   });


// app.get("/", (req, res) => {
//     console.dir(req.cookies);  // parsing cookies
//     res.send("Hi, I am root");
//   });
// ----------------------------------------------------------
 
//express session
app.use(session ({secret:"hfddfghjk"}));
app.get("/test", (req,res) => {
    res.send("test successful");
});

app.listen(8080, () => {
    console.log("server is listening to port 8080");
  });