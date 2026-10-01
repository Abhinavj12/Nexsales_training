// import express from 'express';

// const app = express();

// app.use(express.json());

// app.get('/',(req,res)=>{
//     res.status(200).json({
//         message:"Welcome to express API",
//     })    
// })

// const PORT = process.env.PORT ?? 3000;

// app.listen(PORT,()=>{
//     console.log(`Server running on port : ${PORT}`);
        
// })

import express from 'express';
import studentRoutes from './routes/studentRoutes.js';

const app = express();

app.use(express.json());

app.use('/api/students', studentRoutes);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});