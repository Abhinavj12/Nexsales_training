// console.log("Heloo");

// var a="Abhinav";

// let age=13
// const x=10;

// console.log(a);
// console.log(age);
// console.log(x);

// age=21;
// console.log(age);

// x=11;
// console.log(x);

//
// function cal1(price,tax){
//     const totalPrice=price+(price*tax);
//     return totalPrice;
// }
// console.log(cal1(1000,10));

// const cal2=function(price,tax){
//     const totalPrice=price+(price*tax);
//     return totalPrice;
// }
// console.log(cal2(1000,10));

// const cal3=(price,tax)=>{
//     const totalPrice=price+(price*tax);
//     return totalPrice;
// }
// console.log(cal3(1000,10));

//

// function createUser(name,userType="Regular"){
//     return {name:name,userType:userType};
// }
// console.log(createUser("Alice"));
// console.log(createUser("Abhinav","admin"));

// function sumAll(...numbers){
//     return numbers.reduce((total,num)=>{
//         return total+num;
//     },0);
// }
// console.log(sumAll(1,2,3,4,5));

// function sumAll1(...numbers){
//     let total=0;
//     for(let num of numbers){
//         total=total+num;
//     }
//     return total;
// }
// console.log(sumAll1(1,2,3,4,5));


//callBack function
// const fetchWithCallBack=(callback)=>{
//     const data={id:1,name:"Abhinav"};
//     callback(data);
// }

// fetchWithCallBack((data)=>{
//     console.log("data received",data);
// });

//03 -Arrays Function
const numbers=[1,2,3,4,5];

//for each
// numbers.forEach((num)=>{
//     console.log(num);
// })
// sum=0;
// numbers.forEach((num)=>{
//     sum+=num;
// })
// console.log(sum);


// const res1=numbers.reduce((total,num)=>{
//     console.log("total "+total+" num "+num);
//     return total+=num;
// });
// console.log(res1);      //take intial value as 1st element

// const res2 = numbers.reduce((total, num) => {
//     console.log("total:", total, "num:", num);
//     return total + num;
// }, 0);
// console.log(res2);

//map
const squ=numbers.map((num)=>{
    return num*2;
})
// console.log(squ);

//filter
const even=numbers.filter((num)=>{
    return num%2==0;
})
// console.log(even);

//find
const foundnumber=numbers.find((num)=>{
    return num<4;
})
// console.log(numbers)
// console.log(foundnumber)

//sort
const arr=[11,2,4,13,6,2];
// console.log(arr.sort()); //good for string bcoz it start lexiographically
// console.log(arr.sort(
//     (a,b)=>a-b
// ));

//evry-> For Each value condt should satisfied
const allgreaterThanZero=arr.every((num)=>{
    return num>0;
})
//console.log(allgreaterThanZero);

//some
const anyGraterThanTen=arr.some((num)=>{
    return num>10;
})
//console.log(anyGraterThanTen);

//find unique numbers
const unique=[... new  Set(arr)];
//console.log(unique);

//spread
const newNum=[...arr,100,111,123];
//console.log(newNum);

const orders=[{
    id:1,
    product:"Laptop",
    quantity:2,
    price:1000
},
{
    id:2,
    product:"Mobile",
    quantity:3,
    price:700
},
{
    id:3,
    product:"Ipad",
    quantity:4,
    price:600
}
];

const order_price=orders.map((order)=>{
    return order.price;
})
//console.log(order_price);

const orderWithTotalPrice=orders.map((order)=>{
    return{
        ...order,
        totalPrices:order.price*order.quantity
    }
});
//console.log("orders with total price",orderWithTotalPrice);

const total = orders.reduce((t, order) => {
    return t + (order.price *order.quantity);
}, 0);
//console.log(total);


//object destructing

const user={
    name:"Abhinav",
    age:22,
    email:"abhinav@gmail.com"
};

//extract
const{name:userName,age}=user;
console.log("Name",userName);
console.log("Age",age);











//Promises
// let age=17;
// let promise=new Promise((resolve,reject)=>{
//     if(age>18) resolve("You can Vote");
//     else reject("You Cant Vote");
// })
// promise
// .then((message)=>{  //Excuted when Promise is success or resolve
//     console.log(message);
// })
// .catch((error)=>{   //Excuted when Promise is rejected
//     console.log(error);
// })
// .finally(()=>{      //Always Excuted irrespective whether promise is resloev or reject
//     console.log("Finished")
// })

//Api Req using fetch
// let url="https://catfact.ninja/fact";
// fetch(url)
// .then((response)=>{
//     return response.json();
// })
// .then((data)=>{
//     console.log(data);
//     return data.fact;
// })
// .then((fact)=>{
//     console.log(fact);
// })
// .catch((error)=>{
//     console.log(error)
// });

//Api req uisng AXIOS   