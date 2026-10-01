import readline from "readline/promises";
import {stdin as input,stdout as output} from "process";

const rl=readline.createInterface({input,output});
const city=await rl.question("Enetr City Name: ");

// Validation

if(city.trim()===""){
    console.log("City name cannot be empty");
}else{
    console.log("City Entered :",city);
}
rl.close();