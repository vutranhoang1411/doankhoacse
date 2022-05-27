const knex = require ('../model/connectDB');
const canvas = require('canvas');
const path = require('path');
const socketio = require('../socket/socketio');
let imgData = require('../testing.json');
const faceapi = require('@vladmandic/face-api');
const confirmCheckin = async(req,res,next)=>{
    try{
        const {ID}=req.body;
        // await knex('attendances').where({
        //     ID:ID,
        // }).update({
        //     check_in:'1',
        // })
        console.log(ID);
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
        // await knex('attendances').where({
        //     ID:ID,
        //     check_in:'1'
        // }).update({
        //     check_out:'1',
        // })
        console.log(ID);
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
        for (let i=0;i<imgData.length;i++){
            imgData[i]=new faceapi.LabeledFaceDescriptors(imgData[i].label,[new Float32Array(imgData[i].descriptors[0])]);
        }
        // console.log(imgData[0] instanceof faceapi.LabeledFaceDescriptors);
        
        // imgData.map(element=>new faceapi.LabeledFaceDescriptors(element.label,[new Float32Array(element.descriptors[0])]));

        const faceMatcher = new faceapi.FaceMatcher(imgData,0.5);
        const bestMatch = faceMatcher.findBestMatch(req.body.data);

        // const bestMatch = faceMatcher.findBestMatch(result2.descriptor);
    
        if (bestMatch.label==='unknown'){
            res.json({
                identify:false,
                msg:`cant identify user`
            })
        }
        else{
            //update db

            ////push to socket
            socketio.getIO().emit('student_join',bestMatch.label);

            //server responsex
            res.json({
                identify:true,
                className:"mt20kh10",
                ID:2013245,
                name:bestMatch.label
            });
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

const render_in = async(req,res,next)=>{
    res.render('in');
}
const render_out = async(req,res,next)=>{
    res.render('out');
}
const render_test = async(req,res,next)=>{
    res.render('test');
}
module.exports={userCheckin,emit_testing,render_in,render_out,render_test,confirmCheckin,confirmCheckout}