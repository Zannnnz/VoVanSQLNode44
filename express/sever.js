// B1: Import lib Express
import express from 'express'

//B2: Tao Object express
const app = express();

//Them middleware de doc data Json
app.use(express.json());

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
 app.post(`/users/:id/:hoTen`,(req,res)=>{
    let params = req.params;
    let {id,hoTen} = params;
    let body = req.body;
    res.send({
        id,
        hoTen
    });
 })
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