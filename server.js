const express = require('express');
const http = require('http');
const cors = require('cors')
const nodemailer = require('nodemailer');
const email = 'legaltechchallenge@gmail.com';
const app = express();
let webpush = require('web-push');
app.use(cors())
app.use(express.static('public'));
// app.use(express.json())
app.use(express.json({limit: '15mb'}));
const server = http.createServer(app);
var sub = [];
app.get('/register', function (req, res) {
    res.sendFile(__dirname+'/public/register.html')
});

app.get('/final', function (req, res) {
    res.sendFile(__dirname+'/public/final.html')
});

app.post('/push', (req, res) => {
    sub.push(req.body);
    console.log(sub);
    res.set('Content-type', 'application/json');
    webpush.setVapidDetails(
        'mailto:andrewmuliar7@gmail.com',
        'BBfIYcTZiDsIiWGhdFZU9ThIKZVdYcf5KI0XCAa5pSNQy06mZT9t2hmC0XhQB9zY-Lw1DQVjc4hEd1l3Wv_noak',
        'YJqYAXc_77xKzSRK7FoxHvcHtvHinb8xmBE11X44aW0'
    )
    let payload = JSON.stringify({
        "notification":{
            "title":"My Title",
            "body":"My body",
            "icon":"https://lh3.google.com/u/0/d/1-BTuNeBsKG85CjABETj5_JdBtI8YwhDp=w1920-h969-iv1"
        }
    })
    Promise.resolve(webpush.sendNotification(sub[0], payload)).then(
        () => {
            res.status(200).json({message:'Sended'})
        })
        .catch( error => {
            console.log('error', error);
            res.sendStatus(500);
        })
})

app.post('/try', (req, res) => {
    let payload = JSON.stringify({
        "notification":{
            "title":"GG",
            "body":"Another not",
            "icon":"https://lh3.google.com/u/0/d/1-BTuNeBsKG85CjABETj5_JdBtI8YwhDp=w1920-h969-iv1",
            "image":"https://wallpaperplay.com/walls/full/7/2/6/42463.jpg"
        }
    })
    Promise.resolve(webpush.sendNotification(sub[0], payload)).then(
        () => {
            res.status(200).json({message:'Sended'})
        })
        .catch( error => {
            console.log('error', error);
            res.sendStatus(500);
    })
})

app.post('/sendEmail', function(req, res){
    // console.log('body', req.body)
    // console.log('file Base', req.body.file)
    const transport = nodemailer.createTransport({
        service:'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth:{
            user:email,
            pass:'2019-legal-tech-challenge-2019'
        }
    })
    
    const message = {
        from:email,
        to:'Dziadevych@aequo.ua, legaltechchallenge@gmail.com, innovate@aequo.ua',
        subject:'Hello there',
        text:`Имя фамилия: ${req.body.name }
              Телефон: ${req.body.phone}
              E-mail: ${req.body.email}
              Ссылка: ${req.body.link}
              Описание идеи:${req.body.description}`,
        attachments:[
            {
                path:req.body.file
            }
        ]
    }
    
    transport.sendMail(message, (err) => {
        if(err){
            console.log('error', err)
            return;
        }
        console.log('Email sent...');
    })
    res.send(req.body)
})

app.get('/', function(req, res){
    // res.sendFile(__dirname+'/public/index.html');
    res.sendFile(__dirname+'/public/index.html')
})

server.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});