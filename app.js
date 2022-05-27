const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
require('dotenv').config();
const routes = require('./routes/routes.js');
const faceapi = require('@vladmandic/face-api');
const canvas = require('canvas');

// const io = require('socket.io')(5000,{
//     cors:{
//         origin:['http://localhost:8080'],
//     },
// });
const socketio=require('./socket/socketio.js');
const error_handler=require ('./middleware/error_handler');
const not_found=require('./middleware/not_found');

const exphbs = require('express-handlebars');
const hbs = exphbs.create({ extname: '.hbs'});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set("views", 'views'); 

app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.use('/api/v1',routes);

app.use(error_handler);
app.use(not_found)

const PORT = process.env.PORT||3000;
const start = async()=>{

    try{
        
        ///I have no idea what is this
        faceapi.env.monkeyPatch({ Canvas: canvas.Canvas, Image: canvas.Image, ImageData: canvas.ImageData });
        await faceapi.tf.setBackend('tensorflow');
        await faceapi.tf.enableProdMode();
        await faceapi.tf.ENV.set('DEBUG', false);
        await faceapi.tf.ready();
        ///load model
        const modelPath=process.env.modelPath;
        await faceapi.nets.tinyFaceDetector.loadFromDisk(modelPath)
        await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
        await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
        await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
        const server = app.listen(PORT,()=>{
            console.log(`Server run at port ${PORT}`);
        })

        //init socket
        socketio.init(server,process.env.corsPORT);
        socketio.getIO().on('connect',socket=>{
            console.log(`socket with id ${socket.id} connect`);
        })

    }catch(error){
        console.log(error);
    }
}
start();