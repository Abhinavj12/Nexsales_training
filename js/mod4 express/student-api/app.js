import express from 'express';
import studentRoutes from './routes/studentRoutes.js'
const app=express();
app.use(express.json());
app.use('/api/students',studentRoutes);
const PORT=Number(process.env.PORT) || 3000;

// app.get("/",(req,res)=>{
//     //res.send("welcome to Student API");
//     // res.json({
//     //     "message":"Welcome to Student API"
//     // });
//     res.send("<h1>Hello World</h1>");
// })

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});
