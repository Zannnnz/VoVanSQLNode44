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
//B2: Tao Object express
const app = express();

//Them middleware de doc data Json
app.use(express.json());
// import cors
app.use(cors());
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



app.listen(8080, () => {
    console.log("sever online at port 8080");
});

