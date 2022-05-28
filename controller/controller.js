const knex = require ('../model/connectDB');
const canvas = require('canvas');
const path = require('path');
const socketio = require('../socket/socketio');
let imgData = require('../data/faceData.js');
const faceapi = require('@vladmandic/face-api');
let count=0;
const confirmCheckin = async(req,res,next)=>{
    try{
        const {ID}=req.body;

        //update db
        await knex('attendances').where({
            ID:ID,
        }).update({
            check_in:'1',
        })
        count++;
        //get name
        const {name} = await knex('attendances').where({
            ID:ID,
        }).first();
        ////push to socket
        socketio.getIO().emit('student_join',{name:name,status:"in"});

        //server response
        res.json({
            msg:'success'
        })
    }catch(error){
        console.log(error);
        next(error);
    }
}
const confirmCheckout= async(req,res,next)=>{
    try{
        const {ID}=req.body;

        ///update db
        await knex('attendances').where({
            ID:ID,
            check_in:'1'
        }).update({
            check_out:'1',
        })
        count--;
        const {name} = await knex('attendances').where({
            ID:ID,
        }).first();
        socketio.getIO().emit('student_join',{name:name,status:"out"});
        ///server response
        res.json({
            msg:'success'
        })
    }catch(error){
        console.log(error);
        next(error);
    }
}

const userCheckin = async(req,res,next)=>{
    try{
        
        // const {SID,name}=req.body;
        // //get db image
        // const imagePath = path.join(__dirname,'../public',SID+'.jpg');
        // const dbImg=await canvas.loadImage(imagePath);
        // const c1=canvas.createCanvas(dbImg.width,dbImg.height);
        // c1.getContext('2d').drawImage(dbImg,0,0,dbImg.width,dbImg.height);
    
        // ///get user's checkin image
        // const checkinImg= await canvas.loadImage(req.files.img.data);//req.files.{input name}.data
        // const c2 = canvas.createCanvas(checkinImg.width,checkinImg.height);
        // c2.getContext('2d').drawImage(checkinImg,0,0,checkinImg.width,checkinImg.height);        

        // const result1 = await detectSingleFace(c1,new SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptor();
        // const result2 = await detectSingleFace(c2,new SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptor();

        
        // console.log(imgData[0] instanceof faceapi.LabeledFaceDescriptors);
        
        // imgData.map(element=>new faceapi.LabeledFaceDescriptors(element.label,[new Float32Array(element.descriptors[0])]));

        const faceMatcher = new faceapi.FaceMatcher(imgData,0.45);
        const bestMatch = faceMatcher.findBestMatch(req.body.data);

        // const bestMatch = faceMatcher.findBestMatch(result2.descriptor);
    
        if (bestMatch.label==='unknown'){
            res.json({
                identify:false,
                msg:`cant identify student`
            })
        }
        else{
            //query db
            const data = await knex('attendances').select('ID','name').where({
                ID:bestMatch.label
            }).first();

            if (data){
                res.json({
                    identify:true,
                    ID:data.ID,
                    name:data.name
                });
            }
            else{
                res.json({
                    identify:false,
                    msg:"can't find you student ID",
                })
            }
            
        } 
    }catch(error){
        console.log(error);
        next(error);
    }
}

const emit_testing = async(req,res,next)=>{
    const {SID}=req.body;
    socketio.getIO().emit('testing-emit',SID);
    res.json({
        msg:"is it okay??"
    })
}

const render_checkin = async(req,res,next)=>{
    res.render('checkin');
}
const render_checkout = async(req,res,next)=>{
    res.render('checkout')
}
const render_out = async(req,res,next)=>{

    res.render('out',{count});
}
const render_test = async(req,res,next)=>{
    res.render('test');
}
module.exports={userCheckin,emit_testing,render_checkin,render_checkout,render_out,render_test,confirmCheckin,confirmCheckout}