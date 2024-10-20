//B1: nom init -> tao file package.json
//B2: tao file index.js (file tong trong source BE)
//B3: install lib expressJS(npm i express)
//B4: update file package.json
    //+ Them "type": "module"
    //+ Them script start server: "start": "node index.js"
//B5: khoi tao du an:
    //+ import thu vien express(import express from 'express')
    //+ tao object app (cont app = express())
    //+ Khoi tao port cho BE (app.listen(8080))
    //+ start server (npm run start)
// B1: Import lib Express
import express from 'express'
import pool from './db.js';
import {OK,INTERNAL_SERVER} from './const.js'
import rootRoutes from './src/router/root.router.js';
import cors from 'cors';
import cookieParser  from 'cookie-parser';
import {Server} from 'socket.io';// lib socket IO dung de tao server chat realtime
import {createServer} from 'http';
import { Prisma, PrismaClient } from '@prisma/client';
//B2: Tao Object express
const prisma = new PrismaClient();

const app = express();


//define middleware de public folder public
app.use(express.static("."));

//Them middleware de doc data Json
app.use(express.json());
// import cors
app.use(cors({
    origin:"http://localhost:3000",// cap quyen cho FR
    credentials: true //cho phep FE lay cookie va luu vao cookie browser
}));

//B3: tao http server
//io: object cua socket server
// socket: object socket cua socket client
const server = createServer(app);

// tao socketIO server 
const io = new Server(server,{
    cors:{
        origin:"*"
    }
});
// lang nghe event ket noi tu client (FE) qua socketIO
// on: nhan event
// emit: gui event di
// on va emit co 2 params:
// param 1: event type: event cua socketIO hoac event cua user tu define
// param 2: fuction
let number = 0; // Dat bien toan cuc
io.on('connection',(socket)=>{
    console.log(socket.id);

    socket.on("send-click",()=>{
        console.log("FE send click");
        number = number+1;
        // server ba event cho tat client
        io.emit("send-new-number",number);
    })
    //Nhan event reduce-number
    socket.on("reduce-number",()=>{
        number-=1;
        io.emit("send-new-number",number);  
    })

    // Nhan event send-mess
    socket.on("send-mess",async ({user_id,content})=>{
        let newChat = {
            user_id,
            content,
            date: new Date()
        };
        // luu chat vao database
        await prisma.chat.create({data: newChat});

        //server ban event cho tat ca client
        io.emit("sv-send-mess",{user_id,content});
    })
})
//BE se nhan event tu FE client

app.use(cookieParser());

// import rootRoutes
app.use(rootRoutes);



//B3: define port cho BE Chay
//params 1: define port BE
//params 2: callback fuction
app.get(`/`, (req,res,next) => {
    res.send("hello node 44");
 });

 app.get(`/test`,(req,res)=>{
    res.send("Hello vo van");
 })
//demo get params tu URL
//  app.post(`/users/:id/:hoTen`,(req,res)=>{
//     let params = req.params;
//     let {id,hoTen} = params;
//     let body = req.body;
//     res.send({
//         id,
//         hoTen
//     });
//  })
//demo get query tu URL

app.get(`/testquery`,(req,res)=>{
    let query = req.query;
    res.send(query);
 })

//demo get header from request
app.get(`/test-header`,(req,res)=>{
    let headers = req.headers;
    res.send(headers);
 })



server.listen(8080, () => {
    console.log("sever online at port 8080");
});

