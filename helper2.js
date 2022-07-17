const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const { file } = require('googleapis/build/src/apis/file');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
// fs.readFile('credentials.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   // Authorize a client with credentials, then call the Google Drive API.
//   authorize(JSON.parse(content), downloadImg);
// });

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}
const downloadImg= async(auth)=>{
    const drive = google.drive({version:'v3',auth:auth});
    let data = fs.readFileSync('data.csv','utf-8');
    data=data.split("\r\n");
    let IDarray=[];
    for (let j=0;j<data.length;j++){
        const element=data[j];
        const lines = element.split(',');
        const id = lines[2];
        if (!IDarray.includes(id)){
          IDarray.push(id);
          for (let i=4;i<=6;i++){
            let filePath=`${__dirname}/real_img/${id}_`;
            if (i==4) filePath+="1.jpg";
            else if (i==5)  filePath+="2.jpg";
            else filePath+="3.jpg";
            const source=fs.createWriteStream(filePath);
            let link=lines[i];
            if (link.includes("id=")) link=link.split("id=")[1];
            else  {
              const temp = link.split("/d/")[1];
              link=temp.substr(0,33);
            }
            try{
              const driveResponse=await drive.files.get({fileId:link,alt:'media'},{responseType:'stream'});
              driveResponse.data.pipe(source);
            }
            
            catch(error){
              console.log(id);
            }
          }
        }  
    }
    
    // https.get('https://drive.google.com/open?id=1bfIUNV9OSucQ0t19TEUnrBj_OlxCmaoK',(res)=>{
    //     const path=`${__dirname}/real_img/${data[0].split(',')[2]}.jpeg`;
    //     const filePath=fs.createWriteStream(path);
    //     res.pipe(filePath);
    //     filePath.on('finish',()=>{
    //         filePath.close();
    //     })
    // })
}
