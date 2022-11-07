var express = require('express');
const { response } = require('../app');
const adminHelpers = require('../helpers/admin-helpers');
const userHelpers = require('../helpers/user-helpers');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  let adminData=req.session.admin
  if (req.session.adminIn) {
      adminHelpers.getAllUser().then((users)=>{
      res.render('admin/view-user',{admin:true,add:true,adminData,users})
    })
  }else{
    res.redirect('/admin/admin-login')
  }

  
});

router.get('/admin-login',(req,res)=>{
  if(req.session.adminIn){
    res.redirect('/admin')
  }else{
    res.render('admin/admin-login',{admin:true,loginErr:req.session.adminloginErr})
    req.session.adminloginErr=false
  }
})

router.post('/admin-login',(req,res)=>{
  adminHelpers.doLogin(req.body).then((response)=>{
    if (response.status) {
      req.session.adminIn=true
      req.session.admin=response.admin
      res.redirect('/admin')
    }else{
      req.session.adminloginErr = true
      res.redirect('/admin/admin-login')
    }
  })
})

router.get('/admin-logout',(req,res)=>{
  req.session.admin=null
  req.session.adminIn=false
  res.clearCookie()
  res.redirect('/admin/admin-login')
})


router.get('/add-user', (req, res) => {
  res.render('admin/add-user', { admin: true, split: false, show: true })
})

router.post('/add-user', (req, res) => {
  adminHelpers.addUsers(req.body).then((response)=> {
    if(response.status){

    res.send({vv: "Successfully added User"})
    }
    else{
      res.send({vv:"User already exist"})
    }
  })
})
  

  router.get('/delete-user/:id',(req,res)=>{
    userId=req.params.id
    adminHelpers.deleteUsers(userId).then(()=>{
        res.redirect('/admin')
    })
  })


  router.get('/edit-user/:id', async (req, res) => {
    let user = await adminHelpers.getUserdetails(req.params.id)
    console.log(user)
    res.render('admin/edit-user', { user, admin: true })
  })
   
 

router.post('/edit-user/:id',(req,res)=>{
  adminHelpers.updateUser(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
  })
})



module.exports = router;
