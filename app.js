const express =require('express');

const app=express()

app.use(express.json())



app.get("/",(req,res)=>{
    res.json({
        message:"Hello I am backend developer name is thavasumoorthi"
    })
})


app.post('/api/bodydata',(req,res)=>{
    console.log(req.body);
    res.json({
        message:"Data  received"
    })
})

app.post('/api/headerdata',(req,res)=>{
    console.log(req.headers)
    console.log(req.headers.authorization)
    res.json({
        message:"Headers Receiveds "
    })
})


app.post("/api/paramheader/:id",(req,res)=>{
    console.log(req.params.id)
    res.json({
        message:"Param value are received"
    })
})

app.post("/api/queryheader",(req,res)=>{
    console.log(req.query.id)
    console.log(req.query.name)

    res.json({
        message:"query value received"
    })
})


//checking whether it should throw an error or not without PR Assignee 

app.listen(3000,()=>{

    console.log("App is running on the port 3000")
})