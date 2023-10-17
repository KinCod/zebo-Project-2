require('dotenv').config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(express.urlencoded())   //api calls
app.use(cors())

//db config
const mongoURI = "mongodb://127.0.0.1:27017"     //127 because node js is 18. something version

    mongoose.connect(mongoURI,{
        useNewUrlParser : true,
        useUnifiedTopology : true
    })
    .then(()=>{
        console.log("Connected to MongoDB")})
    .catch((err)=>{
        console.log(console.error(err))
    })


//schema (kya scheme follow krega database

const remindersSchema= new mongoose.Schema({
    title : String,
    desc : String,
    remindat : String,
    isReminded : Boolean
})
const Reminder = new mongoose.model("reminder",remindersSchema)

//whatsapp functionality

setInterval(() => {
    Reminder.find({},(err,reminderList)=>{     //agar sab data find hogya then it will be pushed to frontend
        if(err){
            console.log(err)
        }
        if(reminderList){
            reminderList.forEach(reminder=>{          //saare elements list k
                if(!reminder.isReminded){             // agar is reminded false hai
                    const now = new Date()
                    if((new Date(reminder.remindat)-now)<0){
                        Reminder.findByIdAndUpdate(reminder._id,{isReminded:true},(err,remindObj)=>{
                            if(err){
                                console.log(err);
                            }

                            const accountSid =  process.env.ACCOUNT_SID;
                            const authToken = process.env.AUTHTOKEN;
                            const client = require('twilio')(accountSid, authToken);
                    
                            client.messages
                                .create({
                                    body: "Title : "+reminder.title +"!! Desc : "+ reminder.desc,
                                    from: 'whatsapp:+14155238886',
                                    to: 'whatsapp:+917650915887'
                                })
                                .then(message => console.log('twilio_active'))
                        })
                    }
                }
            })
        }
    })
       
    },1000 );


//Api Routes

app.get("/getAllReminder",(req,res)=>{
    Reminder.find({},(err,reminderList)=>{     //agar sab data find hogya then it will be pushed to frontend
        if(err){
            console.log(err)
        }
        if(reminderList){
            res.send(reminderList)
        }
    })
})
app.post("/addReminder",(req,res)=>{            //ismai hum send krenge reminder ka message and time. Uske baad db mai store krenge. iske baad again ye data front end par bhejenge (upar wala get)
    const {title,desc, remindat} = req.body;
    const reminder = new Reminder({
        title,                                //reminder ek object hai jismai msg and time store ho rha hai
        desc,
        remindat,
        isReminded : false                         //to check if remind hua ki nhi abhi tak
    })
    reminder.save(err=>{                              //storing in db
        if(err){
            console.log(err)
        }
        Reminder.find({},(err,reminderList)=>{     //agar sab data find hogya then it will be pushed to frontend
            if(err){
                console.log(err)
            }
            if(reminderList){
                res.send(reminderList)
            }
        })
    })
})

app.post("/deleteReminder",(req,res)=>{
    Reminder.deleteOne({_id: req.body.id} ,()=>{
        Reminder.find({},(err,reminderList)=>{     //agar sab data find hogya then it will be pushed to frontend
            if(err){
                console.log(err)
            }
            if(reminderList){
                res.send(reminderList)
            }
        })
    }
    )
})
app.get("/",(req,res)=>{
    res.send("Hello balle")
})

app.listen(9000,()=>console.log("started"))

