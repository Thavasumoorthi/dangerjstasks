const express =require('express');

const app=express()

app.use(express.json())



app.get("/",(req,res)=>{
    res.json({
        message:"Hello I am backend developer name is thavasumoorthi"
    })
})


app.post('/api/bodydata',(req,res)=>{
    res.json({
        message:"Data  received"
    })
})

app.post('/api/headerdata',(req,res)=>{
    res.json({
        message:"Headers Receiveds "
    })
})


app.post("/api/paramheader/:id",(req,res)=>{
    res.json({
        message:"Param value are received"
    })
})

app.post("/api/queryheader",(req,res)=>{
    res.json({
        message:"query value received"
    })
})


app.listen(3000,()=>{

})