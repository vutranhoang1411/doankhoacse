const faceapi = require('@vladmandic/face-api');
const canvas = require('canvas');
const https=require('https');
const {google}=require('googleapis');
require('dotenv').config();

const fs = require('fs');
faceapi.env.monkeyPatch({ Canvas: canvas.Canvas, Image: canvas.Image, ImageData: canvas.ImageData });
const knex = require('./model/connectDB');

const getapidata=async ()=>{
    await faceapi.tf.setBackend('tensorflow');
    await faceapi.tf.enableProdMode();
    await faceapi.tf.ENV.set('DEBUG', false);
    await faceapi.tf.ready();
    const modelPath='./node_modules/@vladmandic/face-api/model';
    ///load model
    // await faceapi.nets.tinyFaceDetector.loadFromDisk(modelPath);
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
    let data=[];
    fs.readdir(__dirname+'/testing_img',async (err,files)=>{
        
        if (err) console.log(err);
        for (let i=0;i<files.length;i++){
            const testingImg = await canvas.loadImage(__dirname+'/testing_img/'+files[i]);
            const c1=canvas.createCanvas(testingImg.width,testingImg.height);
            c1.getContext('2d').drawImage(testingImg,0,0,testingImg.width,testingImg.height);
            const result1 = await faceapi.detectSingleFace(c1,new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptor();
            const labeledRes = new faceapi.LabeledFaceDescriptors(files[i].split('.')[0],[result1.descriptor]);
            data.push(labeledRes);
        }
        const faceMatch = new faceapi.FaceMatcher(data);
        faceMatch.labeledDescriptors.forEach(element=>{
            console.log(element.label+' vs '+data[1].label);
            console.log(faceMatch.computeMeanDistance(data[1].descriptors[0],element.descriptors));
        })
        // fs.writeFile(__dirname+'/testing.json',JSON.stringify(data),err=>{
        //     if (err){
        //         console.log(err);
        //     }
        // })
    })
}
// getapidata();
const getFaceData=async()=>{
    await faceapi.tf.setBackend('tensorflow');
    await faceapi.tf.enableProdMode();
    await faceapi.tf.ENV.set('DEBUG', false);
    await faceapi.tf.ready();
    const modelPath='./node_modules/@vladmandic/face-api/model';
    ///load model
    // await faceapi.nets.tinyFaceDetector.loadFromDisk(modelPath);
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
    let data = fs.readFileSync('data.csv','utf-8');
    data=data.split("\r\n");
    let IDArray=[];
    for (let i=0;i<data.length;i++){
        const element=data[i];
        const lines = element.split(',');
        const id = lines[2];
        if (!IDArray.includes(id)){
            IDArray.push(id);
            let singleFaceData=[];
            for (let j=1;j<=3;j++){
                try{
                    const testingImg = await canvas.loadImage(`${__dirname}/real_img/${id}_${j}.jpg`);
                    const c1=canvas.createCanvas(testingImg.width,testingImg.height);
                    c1.getContext('2d').drawImage(testingImg,0,0,testingImg.width,testingImg.height);
                    const result1 = await faceapi.detectSingleFace(c1,new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptor();
                    if (result1) singleFaceData.push(result1.descriptor);
                }catch(error){
                    console.log(id);
                    console.log(error);
                }
                
            }
            if(singleFaceData.length>0)    await fs.promises.appendFile('./data/faceData.json',","+JSON.stringify(new faceapi.LabeledFaceDescriptors(id,[...singleFaceData])));
        }
    }
}
// getFaceData();
const insertDB=async()=>{
    //read file csv
    var data = await fs.promises.readFile('data.csv','utf-8');
    ///
    data = data.split("\r\n");
    data.forEach(async (element)=>{
        const line = element.split(',');
        try{
            await knex('attendances').insert({
                ID:line[3],
                name:line[0],
                email:line[9],
            })
        }catch(error){
            console.log(error);
        }
    })
}
insertDB();

const downloadImg= async()=>{

    var data = fs.readFileSync('data.csv','utf-8');
    data=data.split("\r\n");
    const fileId='1bfIUNV9OSucQ0t19TEUnrBj_OlxCmaoK';
    const path=`${__dirname}/real_img/${data[0].split(',')[2]}.jpeg`;
    const filePath=fs.createWriteStream(path);
    const drive = google.drive({version:'v3',})
    // https.get('https://drive.google.com/open?id=1bfIUNV9OSucQ0t19TEUnrBj_OlxCmaoK',(res)=>{
    //     const path=`${__dirname}/real_img/${data[0].split(',')[2]}.jpeg`;
    //     const filePath=fs.createWriteStream(path);
    //     res.pipe(filePath);
    //     filePath.on('finish',()=>{
    //         filePath.close();
    //     })
    // })
}
