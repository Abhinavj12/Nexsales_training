// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const UsersData = () => {
//   const [users, setUsers] = useState([]);

//   const readUsers = async () => {
//     try {
//       const response = await axios.get(
//         "https://jsonplaceholder.typicode.com/users"
//       );

//       setUsers(response.data);
//       console.log(response.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     readUsers();
//   }, []);

  // Display users using div
  // return (
  //   <div>
  //     <h2>Users Data</h2>
  //
  //     {users.length > 0 ? (
  //       users.map((user) => (
  //         <div key={user.id}>
  //           <p>ID: {user.id}</p>
  //           <p>Name: {user.name}</p>
  //           <p>Email: {user.email}</p>
  //           <hr />
  //         </div>
  //       ))
  //     ) : (
  //       <p>No Data Available</p>
  //     )}
  //   </div>
  // );

  // NEW WAY: Display users in table
//   return (
//     <div>
//       <h2>Users Data</h2>

//       {users.length > 0 ? (
//         <table border="">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Email</th>
//             </tr>
//           </thead>

//           <tbody>
//             {users.map((user) => (
//               <tr key={user.id}>
//                 <td>{user.id}</td>
//                 <td>{user.name}</td>
//                 <td>{user.email}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No Data Available</p>
//       )}
//     </div>
//   );
// };

// export default UsersData;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import ReusableTable from "./ReusableTable";
// import ReusableModal from "./ReusableModal";

// const UsersData = () => {
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);

//   const readUsers = async () => {
//     try {
//       const response = await axios.get(
//         "https://jsonplaceholder.typicode.com/users"
//       );

//       setUsers(response.data);
//       console.log(response.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     readUsers();
//   }, []);

//   const columns = [
//     {
//       key: "id",
//       label: "ID",
//     },
//     {
//       key: "name",
//       label: "Name",
//     },
//     {
//       key: "email",
//       label: "Email",
//     },
//   ];
//   const handleView = (user) => {
//  // console.log("Selected User:", user);
//  setSelectedUser(user);
// };

//   return (
//     <div>
//       <h2>Users Data</h2>

//       {users.length > 0 ? (
//         <ReusableTable
//           data={users}
//           columns={columns}
//           onView={handleView}
//         />
//       ) : (
//         <p>No Data Available</p>
//       )}

//      <div
//   className="modal fade"
//   id="userModal"
//   tabIndex="-1"
//   aria-labelledby="userModalLabel"
//   aria-hidden="true"
// >
//   <div className="modal-dialog">
//     <div className="modal-content">

//       <div className="modal-header">
//         <h5 className="modal-title" id="userModalLabel">
//           User Details
//         </h5>

//         <button
//           type="button"
//           className="btn-close"
//           data-bs-dismiss="modal"
//           aria-label="Close"
//         ></button>
//       </div>

//       <div className="modal-body">
//         {selectedUser ? (
//           <>
//             <p>
//               <strong>ID:</strong> {selectedUser.id}
//             </p>

//             <p>
//               <strong>Name:</strong> {selectedUser.name}
//             </p>

//             <p>
//               <strong>Username:</strong> {selectedUser.username}
//             </p>

//             <p>
//               <strong>Email:</strong> {selectedUser.email}
//             </p>

//             <p>
//               <strong>Phone:</strong> {selectedUser.phone}
//             </p>

//             <p>
//               <strong>Website:</strong> {selectedUser.website}
//             </p>
//           </>
//         ) : (
//           <p>No user selected</p>
//         )}
//       </div>

//       <div className="modal-footer">
//         <button
//           type="button"
//           className="btn btn-secondary"
//           data-bs-dismiss="modal"
//         >
//           Close
//         </button>
//       </div>

//     </div>
//   </div>
// </div>
//     </div>
//   );
// };
// return (
//   <div>
//     <h2>Users Data</h2>

//     {users.length > 0 ? (
//       <ReusableTable
//         data={users}
//         columns={columns}
//         onView={handleView}
//       />
//     ) : (
//       <p>No Data Available</p>
//     )}

//     <ReusableModal
//       data={selectedUser}
//       title="User Details"
//     />
//   </div>
// );
// export default UsersData;

import React, { useEffect, useState } from "react";
import axios from "axios";
import ReusableTable from "./ReusableTable";
import ReusableModal from "./ReusableModal";

const UsersData = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const readUsers = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );

      setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    readUsers();
  }, []);

  const columns = [
    {
      key: "id",
      label: "ID",
    },
    {
      key: "name",
      label: "Name",
    },
    {
      key: "email",
      label: "Email",
    },
  ];

  const handleView = (user) => {
    setSelectedUser(user);
  };

  return (
    <div>
      <h2>Users Data</h2>

      {users.length > 0 ? (
        <ReusableTable
          data={users}
          columns={columns}
          onView={handleView}
        />
      ) : (
        <p>No Data Available</p>
      )}

      <ReusableModal
        data={selectedUser}
        title="User Details"
      />
    </div>
  );
};

export default UsersData;