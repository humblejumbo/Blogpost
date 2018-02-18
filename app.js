var express           =require('express');
var bodyparser        =require('body-parser');
var mongoose          =require('mongoose');
var methodoverride    =require("method-override");
var expressSanitizer  =require('express-sanitizer');

var app=express();
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(methodoverride("_method"))
app.use(expressSanitizer());
mongoose.connect("mongodb://localhost/blog_app");

/*var blogSchema=new mongoose.Schema(
    {
        title:String,
        image:String,
        body:String,
        created:{type:Date ,default:Date.now()},
    });*/
    
// var Blog=mongoose.model("Blog",blogSchema);
    
var newSchema=new mongoose.Schema(
    {
        title:String,
        image:String,
        body:String,
        created:{type:Date ,default:Date.now()},
        author:String
    });


var article=mongoose.model("article",newSchema);

// article.create({
//     title:"boddjdh",
//     image:"http://www.manvar.com/assets/images/hom_img2.jpg",
//     body:"sgsdhhhhhhhhhhhhhhssssssssss",
//     author:"kalak"
// });

// Blog.create({
//     title:"How the Budget Can Fix India’s Malnourishment Problem",
//     image:"https://www.thebetterindia.com/wp-content/uploads/2018/01/Anit-Adhikary_1a-28.jpg",
//     body:"The problem lies not only in the irregularity of services and a lack of access to them. It also lies in the ignorance of parents, who often fail to understand the effects of undernutrition on a child’s development"
//     + ". Recognising the crucial importance of a holistic emphasis on the age group 0-6, the Integrated Child Development Services (ICDS) Scheme, a centrally sponsored national flagship scheme of the Government of India, aims at addressing health, nutrition and the development needs of young children (0-6 years), pregnant women and nursing mothers.",
//     author:"manmohan"
// });

app.get('/',function(req,res)
{
   res.redirect("/blogs") ;
});

app.get('/blogs',function(req,res)
{
    article.find({},function(err,all)
    {
        if(err)
        console.log("ERROR!");
        else
        res.render("index.ejs",{blogs:all});
    });
    
});

app.get('/blogs/new',function(req,res)
{
    res.render("new.ejs");
});

app.post('/blogs',function(req,res)
{
    req.body.body=req.sanitize(req.body.body);
    var obj={
        title:req.body.title,
        image:req.body.image,
        body:req.body.body,
        author:req.body.author
    };
    
    article.create(obj,function(err,newone)
    {
        if(err)
        console.log("ERROR!");
        else
        {
            console.log(newone);
            res.redirect('/blogs')
        }
    });
});

app.get('/blogs/:id',function(req,res){
    
    article.findById(req.params.id,function(err,found)
    {
        if(err)
        console.log("error!");
        else
        res.render("show.ejs",{blog:found});
    });
});

app.get('/blogs/:id/edit',function(req,res)
{
   article.findById(req.params.id,function(err,found)
   {
       if(err)
       console.log("error!");
       else
        res.render("edit.ejs",{blog:found});
   });
});

app.put('/blogs/:id',function(req,res)
{
    req.body.body=req.sanitize(req.body.body);
    article.findById(req.params.id,function(err,found)
    {
        if(!err)
        {
            found.title=req.body.title;
            found.image=req.body.image;
            found.body=req.body.body;
            found.author=req.body.author;
            
            found.save(function(err,updated)
            {
                if(!err)
                {
                    console.log(updated);
                    res.redirect('/blogs/'+req.params.id);
                }
            });
        }
    });
});

app.delete('/blogs/:id',function(req,res)
{
  article.findById(req.params.id,function(err,found)
  {
      if(!err)
      {
          found.remove(function(err)
          {
              if(!err)
              {
                  console.log("DELETED!");
                  res.redirect("/blogs");
              }
          });
      }
  });

    /*article.findByIdandRemove(req.params.id,function(err)
    {
        if(!err)
        res.redirect('/blogs');
    });*/
});
    
app.listen(process.env.PORT,process.env.IP,function()
{
    console.log("BLOGAPP SERVER HAS STARTED");
});