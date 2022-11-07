var db = require('../config/connection')
var collection = require('../config/collection')
var ObjectId = require('mongodb').ObjectId
const bcrypt = require('bcrypt')
const { response } = require('../app')

module.exports={
    
    doLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            console.log(collection.ADMIN_COLLECTION.email + ' : ' + adminData.email)
            var data = collection.ADMIN_COLLECTION

            if (data.email == adminData.email) {
                bcrypt.compare(adminData.password, data.password).then((loginTrue) => {
                    let response = {}
                    if (loginTrue) {
                        console.log('Login success');
                        response.admin = data;
                        response.status = true;
                        resolve(response);
                    } else {
                        console.log('Login failed');
                        resolve({ status: false });
                    }
                })
            } else {
                console.log('Login failed1');
                resolve({ status: false });
            }
        })
    },
    getAllUser:()=>{
        return new Promise(async(resolve, reject) => {
            let user =await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(user)
        })
        
    },
    addUsers: (user) => {
        return new Promise((resolve, reject) => {

            let response = {}
            db.get().collection(collection.USER_COLLECTION).find({ email: user.email }).toArray().then(async (res_exist) => {

                if (res_exist.length != 0) {
                    resolve({ status: false })
                }
                else {

                    user.password = await bcrypt.hash(user.password, 10)
                    db.get().collection(collection.USER_COLLECTION).insertOne(user).then((data) => {
                        console.log(data);
                        response.dataId = data.insertedId
                        response.status = true
                        resolve(response)
                    })
                }
            })
        })
    },
    deleteUsers:(userId)=>{
        return new Promise((resolve,reject)=>{
           db.get().collection(collection.USER_COLLECTION).deleteOne({_id:ObjectId(userId)}).then((response)=>{
         resolve(response)
          })
        })
    },
    getUserdetails: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ _id: ObjectId(userId) }).then((user) => {
                resolve(user)
            })
        })
    },
    updateUser:(userId,userDetails)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({_id:ObjectId(userId)},{
                $set:{
                    firstName: userDetails.firstName,
                    lastName: userDetails.lastName,
                    email: userDetails.email,
                }
            }).then((response)=>{
                resolve(response)
            })
        })

    }
}