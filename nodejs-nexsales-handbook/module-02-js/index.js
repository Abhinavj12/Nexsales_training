//js scripts

//01 variables
const maxRetryCount = 3; // never changes
let currentAttempt = 0; // will change as retries happen

currentAttempt = currentAttempt + 1; // valid
// maxRetryCount = 5; // This would cause an error since maxRetryCount is declared with const
console.log("maxRetryCount:", maxRetryCount);
console.log("currentAttempt:", currentAttempt);


// --------------------02 functions-------------------------------------------

function calculateTotalPrice(price, taxRate) {
    const taxAmount = price * taxRate;
    const totalPrice = price + taxAmount;
    return totalPrice;
}

function calculateTotalPriceNew(price, taxRate) {
    return price + price * taxRate;
}


//function expression
const calculateDiscountedPrice = function(price, discountRate) {
    return price - price * discountRate;
}

//arrow function
// const calculateDiscountedPrice = (price, discountRate)  => price - price * discountRate;

//arrow function with block body
const formatPrice = (price) => {
    const formattedPrice = `$${price.toFixed(2)}`;
    return formattedPrice;
}

//make function calls
const totalPrice = calculateTotalPrice(100, 0.1);
const discountedPrice = calculateDiscountedPrice(100, 0.2);
const formattedPrice = formatPrice(100);


console.log("Total Price:", totalPrice);
console.log("Discounted Price:", discountedPrice);
console.log("Formatted Price:", formattedPrice);

//default parameters and rest parameters

const createUser = (name, role = "user") => {
    return {
        name: name,
        role: role
    };
}

const user1 = createUser("Alice");
const user2 = createUser("Bob", "admin");

console.log("User 1:", user1);
console.log("User 2:", user2);

const sum = (...numbers) => {
    return numbers.reduce((total, num) => total + num, 0);
}

const totalSum = sum(1, 2, 3, 4, 5);
console.log("Total Sum:", totalSum); 

//simple callback function example

const fetchDataWithCallback = (callback) => {
    setTimeout(() => {
        const data = { id: 1, name: "Sample Data" };
        callback(data);
    }, 1000);
}   

fetchDataWithCallback((data) => {
    console.log("Fetched Data:", data);
});



//03 ------------------------Array functions-----------------------------

const numbers = [1, 2, 3, 4, 5];   

numbers.forEach((num) => {
    console.log("Number:", num);
});

const numbersSum = numbers.reduce((sum, num) => sum + num, 0);
console.log("Sum of numbers:", numbersSum);

const squaredNumbers = numbers.map((num) => num * num);
console.log("Squared Numbers:", squaredNumbers);

const evenNumbers = numbers.filter((num) => num % 2 === 0);
console.log("Even Numbers:", evenNumbers);

const foundNumber = numbers.find((num) => num > 3);
console.log("Found Number:", foundNumber);

const allGreaterThanZero = numbers.every((num) => num > 0);
console.log("All numbers greater than zero:", allGreaterThanZero);

const anyGreaterThanFour = numbers.some((num) => num > 4);
console.log("Any number greater than four:", anyGreaterThanFour);

const sortedNumbers = numbers.sort((a, b) => b - a);
console.log("Sorted Numbers (descending):", sortedNumbers);

const uniqueNumbers = [...new Set([1, 2, 2, 3, 4, 4, 5])];
console.log("Unique Numbers:", uniqueNumbers);

const numbersString = numbers.join(", ");
console.log("Numbers as String:", numbersString);

const numbersArrayFromString = numbersString.split(", ").map(Number);
console.log("Numbers Array from String:", numbersArrayFromString);

const numbersArrayFromString2 = numbersString.split(", ").map((str) => parseInt(str));
console.log("Numbers Array from String (using parseInt):", numbersArrayFromString2);

const numbersArrayFromString3 = numbersString.split(", ").map((str) => Number(str));
console.log("Numbers Array from String (using Number):", numbersArrayFromString3);

const numbersArrayFromString4 = numbersString.split(", ").map((str) => +str);
console.log("Numbers Array from String (using unary plus):", numbersArrayFromString4);

const numbersArrayFromString5 = numbersString.split(", ").map((str) => parseFloat(str));
console.log("Numbers Array from String (using parseFloat):", numbersArrayFromString5);


const orders = [
    { id: 1, product: "Laptop", quantity: 2, price: 1000 },
    { id: 2, product: "Phone", quantity: 5, price: 500 },
    { id: 3, product: "Tablet", quantity: 3, price: 300 }
]; 

const orderAmounts = orders.map((order) => order.quantity * order.price);
console.log("Order Amounts:", orderAmounts);

//map transforms each order to a new object with total price
const ordersWithTotalPrice = orders.map((order) => {
    return {
        ...order,
        totalPrice: order.quantity * order.price
    };
});

console.log("Orders with Total Price:", ordersWithTotalPrice);

const totalRevenue = orders.reduce((total, order) => total + order.quantity * order.price, 0);
console.log("Total Revenue:", totalRevenue);

const expensiveOrders = orders.filter((order) => order.price > 400);
console.log("Expensive Orders:", expensiveOrders);

const orderWithId2 = orders.find((order) => order.id === 2);
console.log("Order with ID 2:", orderWithId2);

const allOrdersAbove100 = orders.every((order) => order.price > 100);
console.log("All orders above $100:", allOrdersAbove100);

const anyOrderAbove1000 = orders.some((order) => order.price > 1000);
console.log("Any order above $1000:", anyOrderAbove1000);

//4. Object Destructuring and Spread Operator

const user = {
    id: 1,
    name: "Alice",
    email: "alice@example.com"
};

//extracting properties from the user object into variables using destructuring
const { id, name, email } = user;
console.log("User ID:", id);
console.log("User Name:", name);
console.log("User Email:", email);

//creating a new object with additional properties using the spread operator

const updatedUser = {
    ...user,
    role: "admin",
    isActive: true
};

console.log("Updated User:", updatedUser);

//Renaming properties during destructuring
const { name: userName, email: userEmail } = user;
console.log("Renamed User Name:", userName);
console.log("Renamed User Email:", userEmail);

//default values during destructuring

const { age = 30 } = user; // age is not present in user, so default value 30 will be used
console.log("User Age (default):", age);

//object shorthand property names

const userId = 2;
const userName2 = "Bob";

const user21 = { id: userId, name: userName2 };
const userNew = { id: userId, name: userName2, role: "user" };
console.log("User 2:", user21);
console.log("User New:", userNew);

// Object shorthand — when variable name matches property name
const productName = 'Laptop';
const price = 55000;
const product = { productName, price }; // same as { productName: productName, price: price }
console.log("Product:", product);

//Nested destructuring
const order = {
    id: 1,
    product: {
        name: "Laptop",
        price: 1000
    },
    customer: {
        name: "Alice",
        email: "alice@email.com"
    },
    quantity: 2
};

const { product: { name: productName2, price: productPrice }, customer: { name: customerName, email: customerEmail }, quantity } = order;
console.log("Product Name:", productName2);
console.log("Product Price:", productPrice);
console.log("Customer Name:", customerName);
console.log("Customer Email:", customerEmail);
console.log("Quantity:", quantity);


//5. Modern ES6 features

//Template literals
const userName3 = "Charlie";
const greeting = `Hello, ${userName3}! Welcome to our website.`;
console.log(greeting);

//Spread operator for arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combinedArr = [...arr1, ...arr2];
console.log("Combined Array:", combinedArr);

//spread operator for objects
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const combinedObj = { ...obj1, ...obj2 };
console.log("Combined Object:", combinedObj);

//spread operator with overriding fields
const obj3 = { a: 1, b: 2 };
const obj4 = { b: 3, c: 4 };
const combinedObj2 = { ...obj3, ...obj4 }; 
console.log("Combined Object with Overriding:", combinedObj2);


const listA = [1, 2, 3];
const listB = [...listA, 4, 5]; // [1, 2, 3, 4, 5]
console.log("Combined List:", listB);

//optional chaining - safely access nested properties that might not exist:
const userProfile = {
    name: "David",
    address: {
        street: "123 Main St",
        city: "New York"
    }
};

const userStreet = userProfile.address?.street; // "123 Main St"
const userCity = userProfile.address?.city; // "New York"
const userZip = userProfile.address?.zip; // undefined, no error thrown
console.log("User Street:", userStreet);
console.log("User City:", userCity);
console.log("User Zip:", userZip);

//Nullish coalescing operator - provide a default value if the left-hand side is null or undefined
//— provide a fallback only for null/undefined (unlike ||, which also triggers on 0 or ''):
const userAge = userProfile.age ?? 25;
console.log("User Age:", userAge); // 25, since userProfile.age is undefined


const port = process.env.PORT ?? 3000;
const retryCount = 0;
const safeRetryCount = retryCount || 5; // 􀀀 becomes 5, because 0 is falsy
const correctRetryCount = retryCount ?? 5; // 􀀀 stays 0, because 0 is not null/undefined
console.log("Safe Retry Count:", safeRetryCount);
console.log("Correct Retry Count:", correctRetryCount);

//6. Modules and Imports

// Note: File extensions (.js) are required in ES Module imports in Node.js
// — this differs from bundler-based frontend setups (like React with Webpack/Vite) 
// where extensions are often optional.

import { add, subtract } from './mathUtils.js';
console.log(add(5, 3)); // 8
console.log(subtract(5, 3)); // 2

import logMessage from './logger.js';
logMessage("This is a log message from the logger module.");

//7. Asynchronous Programming with Promises and Async/Await

// Simulating an asynchronous operation using a Promise
const fetchData = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const data = { id: 1, name: "Sample Data" };
            resolve(data);
        }, 1000);
    });
};

// Using the Promise
// fetchData()
//     .then((data) => {
//         console.log("Fetched Data:", data);
//     })
//     .catch((error) => {
//         console.error("Error fetching data:", error);
//     });



// Fetching real data using a Promise
const fetchPosts = () => {
    return fetch("https://jsonplaceholder.typicode.com/posts")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json();
        });
};


// Using the Promise
fetchPosts()
    .then((posts) => {
        console.log("Fetched Posts:", posts.slice(0, 5));
    })
    .catch((error) => {
        console.error("Error fetching posts:", error);
    });

// Promise chaining example
// fetchData()
//     .then((data) => {
//         console.log("Fetched Data:", data);
//         return fetchPosts();
//     })
//     .then((posts) => {
//         console.log("Fetched Posts:", posts.slice(0, 5));
//     })
//     .catch((error) => {
//         console.error("Error:", error);
//     });


const fetchUsersNew = async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) {
        throw new Error("Unable to fetch data");
    }
    const data = await response.json();
    return data;
};

// fetchUsersNew().then((users) => {
//         console.log("Users:", users);
//     }).catch((error) => {
//         console.log("Error:", error.message);
//     });

import axios from "axios";

const fetchUsers = async () => {
    try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/users");

        return response.data;
    } catch (error) {
        throw new Error("Unable to fetch users");
    }
};

// fetchUsers()
//     .then((users) => {
//         console.log("Users:", users);
//     })
//     .catch((error) => {
//         console.log("Error:", error.message);
//     });


//Accept user input readline/promises

import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

const rl = readline.createInterface({ input, output });

const city = await rl.question("Enter city name: ");

console.log("City entered:", city);

rl.close();


