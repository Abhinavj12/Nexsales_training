

const user={
    name:"Abhinav",
    age:22,
    email:"abhinav@gmail.com"
};

//extract
const{name:userName,age}=user;
//console.log("Name",userName);
//console.log("Age",age);

//add role and isActive properties to user
const upadteUser={
    ...user,
    role:"Admin",
    isActive:true
};
//console.log("update user :",upadteUser);

//using dot operator
user.address="AB NAGAR";
//console.log("update user :",user);

//template liteals
const name="Abhinav"
const a=22;

//console.log(`User name is ${name} and his age is ${a}`);

//object with nested properties

const userProfile={
    name:"Raj",
    email:"raj@email.com",
    address:{
        street:"Andher East",
        pincode:"400058"
    }
};
//console.log(userProfile.address?.landmark);

//nullish coalescing
const userAge=userProfile.age || 25; //it is used to provide deaafult value for falsy values like 0,null undefined
                                        // while ?? used for null and undefined
//console.log("User Age:",userAge);

//modules and imports
import {add,sub} from './mathUtil.js'
//console.log(add(5,10));

//xml http req
//promises
//sync->step by step execution

// const fetchData=()=>{
//     return new Promise((resolve,reject)=>{
//         setTimeout(()=>
//         {
//             const serverIsActive=false;
//             if(serverIsActive){
//                 const data={id:1,name:"Abhinav"}
//                 resolve(data);
//             }else{
//                 reject(new Error('Server is inactive,unable to fetch data'));
//             }
//         })
//     })
// }

// fetchData().then((data)=>{
//     console.log(data);
// })
// .catch((error)=>{
//     console.log(error.message);
// })

const fetchPosts=()=>{
    return fetch("https://jsonplaceholder.typicode.com/users")
    .then((response)=>{
        if(!response.ok){
            throw new Error("unable to fetch data");
        }
        return response.json();
    });
}
fetchPosts().then((data)=>{
    console.log(data.slice(0,5));
}).catch((error)=>{
    console.log(error.message);
})