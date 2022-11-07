var express = require('express');
const { response, render } = require('../app');
const userHelpers = require('../helpers/user-helpers');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  user =req.session.user
  let products=[
    {
      name:"Razer Basilisk V3 Pro",
      description:"Customizable Wireless Gaming Mouse with Razer HyperScroll Tilt Wheel",
      price:"US$159.99",
      image:"https://assets3.razerzone.com/a3Ybm8jEE5HfEXz-3W70ZqDehUs=/500x500/https%3A%2F%2Fhybrismediaprod.blob.core.windows.net%2Fsys-master-phoenix-images-container%2Fh22%2Fh08%2F9447199080478%2Fbasilisk-v3-pro-white-500x500.png"
    },
    {
      name:"Razer DeathStalker V2 Pro",
      description:"Wireless Low-Profile RGB Tenkeyless Optical Keyboard",
      price:"US$219.99",
      image:"https://assets3.razerzone.com/y-RkVoJmw-hsc3rOEZgYbJ0gEdw=/500x500/https%3A%2F%2Fhybrismediaprod.blob.core.windows.net%2Fsys-master-phoenix-images-container%2Fhf1%2Fh11%2F9447199342622%2Fdeathstalker-v2-pro-tkl-white-500x500.png"
    },
    {
      name:"Razer Huntsman V2 Tenkeyless",
      description:"Tenkeyless Optical Gaming Keyboard",
      price:"US$159.99",
      image:"https://assets3.razerzone.com/kZAUFpuXfW98-Pmd1dphEmS6DN4=/500x500/https%3A%2F%2Fhybrismediaprod.blob.core.windows.net%2Fsys-master-phoenix-images-container%2Fhe0%2Fh0e%2F9447199277086%2Fhuntsman-v2-tkl-quartz-500x500.png"
    },
    {
      name:"Razer BlackShark V2 X",
      description:"Multi-platform wired esports headset",
      price:"US$59.99",
      image:"https://assets3.razerzone.com/cjFzPnAY6_Rl7gNlS9vmxgDX5iI=/500x500/https%3A%2F%2Fhybrismediaprod.blob.core.windows.net%2Fsys-master-phoenix-images-container%2Fh31%2Fh0e%2F9447199211550%2Fblackshark-v2-x-quartz-500x500.png"
    },
    {
      name:"Razer Orochi V2",
      description:"Mobile Wireless Gaming Mouse with up to 950 Hours of Battery Life",
      price:"US$69.99",
      image:"https://assets3.razerzone.com/DeWZo7apZ5KRgiCQdQEXDPbka48=/500x500/https%3A%2F%2Fhybrismediaprod.blob.core.windows.net%2Fsys-master-phoenix-images-container%2Fhc9%2Fh0a%2F9447199113246%2Forochi-v2-quartz-500x500.png"
    },
    {
      name:"Razer Blade 14 - QHD 165Hz",
      description:"14-inch Gaming Laptop with AMD Ryzen™ 6900HX",
      price:"US$2,349.99",
      image:"https://assets3.razerzone.com/bCiMgDGWuvoKpPgPwMejZLVuTTA=/500x500/https%3A%2F%2Fhybrismediaprod.blob.core.windows.net%2Fsys-master-phoenix-images-container%2Fhbb%2Fh60%2F9421517488158%2Fblade-14-p8-qhd-quartz-500x500.png"
    },
    {
      name:"Razer Huntsman V2 Analog",
      description:"Gaming Keyboard with Razer™ Analog Optical Switches",
      price:"US$249.99",
      image:"https://assets3.razerzone.com/16i2UZfus0sZx4JBfQlLMf23LO0=/500x500/https%3A%2F%2Fhybrismediaprod.blob.core.windows.net%2Fsys-master-phoenix-images-container%2Fh46%2Fh03%2F9143301505054%2Frazer-huntsman-v2-analog-500x500.png"
    },
    {
      name:"Razer Wireless Controller",
      description:"Officially Licensed Xbox Controller and Quick Charging Stand",
      price:"US$249.97",
      image:"https://assets3.razerzone.com/aLwGyvXk95FEBJKRpoqAIOkJsUc=/500x500/https%3A%2F%2Fhybrismediaprod.blob.core.windows.net%2Fsys-master-phoenix-images-container%2Fhbf%2Fh51%2F9445020237854%2Funiversal-quick-charging-stand-xbox-500x500.png"
    }
  ]
  res.render('user/view-products', { products,user });
  
});
/// login get
router.get('/login',(req,res)=>{
  if (req.session.userLoggedIn||req.session.userLoggedInSign) {
    res.redirect('/')
  }else{
    res.render('user/login',{loginErr:req.session.loginErr});
    req.session.loginErr=false
  }
})

///sign up get
router.get('/signup',(req,res)=>{
  res.render('user/signup')
})

//sign up post
router.post('/signup', (req, res) => {
 
  userHelpers.doSignup(req.body).then((response) => {
    if(response.status){
      req.session.userloggedInSign = true;
      req.session.user = response.userValue
      res.send({ll:"Login Successful"})
    }
    else{
      res.send({ll:"Email already exist"})
      
    }
    
})


})


///login post
router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if (response.status) {
      req.session.user=response.user
      req.session.userLoggedIn=true
      res.redirect('/')
    }else{
      req.session.loginErr=true
      res.redirect('/login')
    }
    
  })
})

///logout

router.get('/logout', (req, res) => {

  req.session.user = null
  req.session.userLoggedIn = false
  req.session.userloggedInSign = false
  res.clearCookie()
  res.redirect('/login')


})
module.exports = router;
