let express = require('express');
let bodyParser=require('body-parser');
let cookieParser=require('cookie-parser');
let app = express();



let port=80
let host ='0.0.0.0'


app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser());
app.use(express.static(__dirname+"/public")); //this middleware will help me serveing static files
//define my middle ware 

app.use((req,res,next)=>{
    console.log('%s %s',req.method , req.url);
    next();
});

//checking functions

let checkid=({user,pass})=>{
    if(user=='admin'&&pass=='eslam')
        return true;
    else
        return false;
}

//defineing needed vars

let id,client_cookies;

// Routing rules

app.get("/",(req,res)=>{
    client_cookies=JSON.parse(JSON.stringify(req.cookies));
   
  
    if(!(client_cookies.hasOwnProperty("user"))){
        res.status(200).redirect("/login");
    }
    else
    {
        res.status(200).redirect("/home");
    }

})

app.get("/login",(req,res)=>{
    let client_cookies=JSON.parse(JSON.stringify(req.cookies));
    
    if(!(client_cookies.hasOwnProperty("login_times"))){
        res.cookie('login_times',0);
    }
 
    if(client_cookies.hasOwnProperty("user")){
        res.status(200).redirect("/home");
    }
    else{
    res.status(200).sendFile(__dirname+'/public/index.html');
    }
    
})

app.post("/login",(req,res)=>{
    let client_cookies=JSON.parse(JSON.stringify(req.cookies));
  id={user:req.body.user,pass:req.body.pass};
  if(checkid(id)){
      res.cookie('user',req.body.user);
      res.cookie('login','Yes')
      res.cookie('login_times',(++(client_cookies.login_times)));
      res.status(200).redirect("/home");
  }
  else{
      res.status(200).sendFile(__dirname+'/public/relogin-index.html');
  }
})

app.get("/home",(req,res)=>{
    let client_cookies=JSON.parse(JSON.stringify(req.cookies));
    if(!(client_cookies.hasOwnProperty("user"))){
        res.status(200).redirect("/login");
    }
    else{
        res.status(200).sendFile(__dirname+'/public/home.html');
    }
})
//
app.post("/home",(req,res)=>{
    if(req.body.logout=="logout"){
        res.clearCookie("user");
        res.cookie('login',"No");
        res.status(200).redirect("/login");
    }
})
app.all("/*",(req,res)=>{
            res.status(404).send("<h1 style="text-align:center" > Error 404 Not found :(  </h1>");
});
app.listen(port,host,()=>{
    console.log("Listening at %s:%s",host,port)
})
