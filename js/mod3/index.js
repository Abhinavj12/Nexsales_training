import { error } from "node:console";
import fs from "node:fs";

//Now we look how to read File
// fs.readFile("note.txt","utf-8",(err,data)=>{
//     if(err){
//         console.log("There is an error",err.message);
//         return ;
//     }
//     console.log(data);
// })

//for writing

// const content="This will overide";
// fs.writeFile("note.txt",content,"utf-8",(error)=>{
//     if(error){
//         console.log("There is an Error",error.message);
//         return;
//     }
// })
// fs.readFile("note.txt","utf-8",(err,data)=>{
//     console.log(data);
// })

//for appending
// const new_Content="Im new content";
// fs.appendFile("note.txt",new_Content,"utf-8",(err)=>{
//     if(err){
//         console.log("failed to append File",err.message);
//         return ;
//     }
//     console.log("Append Succesfully");
// });
fs.readFile("note.txt","utf-8",(err,data)=>{
    console.log(data);
})


// fs.readFile("note.txt","utf-8",(err,data)=>{
//     console.log(data);
//     console.log(data.length);
//     console.log(data.toLowerCase());
//     console.log(data.toUpperCase());
//     console.log(data.split("\n"));
//     console.log(JSON.stringify(data));
//     console.log(data.split(/\r?\n/));
    
// })

// fs.readFile("a.json","utf-8",(err,data)=>{
//     console.log(data);
// })

// fs.readFile("b.csv","utf-8",(err,data)=>{
//     console.log(data.split(/\r?\n/).slice(0,3));
// })