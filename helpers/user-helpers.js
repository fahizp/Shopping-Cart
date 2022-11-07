var db = require('../config/connection')
var collection = require('../config/collection')
const bcrypt = require('bcrypt')
const { response } = require('../app')
const e = require('express')

module.exports={
    doSignup: (userData) => {

        return new Promise(async (resolve, reject) => {

            db.get().collection(collection.USER_COLLECTION).find({ email: userData.email }).toArray().then(async (res_DB) => {

                let response = {}

                if (res_DB.length != 0) {
                    resolve({ status: false })
                } else {

                    userData.password = await bcrypt.hash(userData.password, 10)
                    db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                        response.userValue = userData
                        response.status = true
                        response.data = data.insertedId
                        resolve(response)
                    })
                }



            })

        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((loginTrue) => {

                    if (loginTrue) {
                        console.log('Login success');
                        response.user = user;
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
    }
}