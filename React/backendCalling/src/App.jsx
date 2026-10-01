// import axios from "axios";
// import React from "react";

// function App() {

//   // const readData = async () => {
//   //   try {
//   //     const response = await axios.get(
//   //       "https://jsonplaceholder.typicode.com/users"
//   //     );

//   //     console.log(response.data);
//   //   } catch (error) {
//   //     console.log("Error:", error);
//   //   }
//   // };
//   const readData = async () => {
//     try {
//         const response = await axios.get(
//             'http://localhost:3000/api/students'
//         );

//         console.log(response.data);
//     } catch (error) {
//         console.log(error);
//     }
// };

//   return (
//     <div>
//       <h1>API Data</h1>

//       <button onClick={readData}>
//         Read Data
//       </button>
//     </div>
//   );
// }

// export default App;
import React from 'react';
import Demo from './components/Demo';
import UsersData from './components/UsersData';
import Data from './components/data';
const App = () => {
  return (
    <div>
      {/* <Demo>

      </Demo> */}
      {/* <UsersData></UsersData> */}
      <Data></Data>
    </div>
  )
}

export default App