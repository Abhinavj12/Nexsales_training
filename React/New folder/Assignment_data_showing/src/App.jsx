import React, { useEffect, useState } from "react";

import { readData } from "./data";

import ReusableTable from "./components/ReusableTable";
import DetailModal from "./components/DetailModal";

function App() {
    const [selectedType, setSelectedType] = useState("users");
    const [data, setData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);

    const resources = {
        users: {
            label: "Users",

            url: "https://jsonplaceholder.typicode.com/users",

            columns: [
                {
                    key: "id",
                    label: "ID"
                },
                {
                    key: "name",
                    label: "Name"
                },
                {
                    key: "username",
                    label: "Username"
                },
                {
                    key: "email",
                    label: "Email"
                }
            ]
        },

        posts: {
            label: "Posts",

            url: "https://jsonplaceholder.typicode.com/posts",

            columns: [
                {
                    key: "id",
                    label: "ID"
                },
                {
                    key: "title",
                    label: "Title"
                },
                {
                    key: "userId",
                    label: "User ID"
                }
            ]
        }
    };


    // Function to fetch data
    const handleSelect = async (type) => {
        setSelectedType(type);
        setSelectedItem(null);

        const resource = resources[type];

        try {
            const result = await readData(resource.url);

            setData(result);
        } catch (error) {
            console.error("Error fetching data:", error);
            setData([]);
        }
    };


    // Load Users automatically when page loads
    useEffect(() => {
        handleSelect("users");
    }, []);


    const currentResource = resources[selectedType];


    return (
        <div className="container-fluid">

            <div className="row min-vh-100">


                {/* LEFT SIDEBAR */}

                <div className="col-md-2 bg-dark text-white p-4">

                    <h3 className="mb-4">
                        Dashboard
                    </h3>

                    <div className="d-grid gap-2">

                        {Object.keys(resources).map((type) => (

                            <button
                                key={type}
                                className={`btn ${
                                    selectedType === type
                                        ? "btn-primary"
                                        : "btn-outline-light"
                                }`}
                                onClick={() => handleSelect(type)}
                            >
                                {resources[type].label}
                            </button>

                        ))}

                    </div>

                </div>


                {/* RIGHT SIDE */}

                <div className="col-md-10 p-4">

                    <h2 className="mb-4">
                        {currentResource.label}
                    </h2>


                    <ReusableTable
                        data={data}
                        columns={currentResource.columns}
                        onView={setSelectedItem}
                    />

                </div>

            </div>


            {/* DETAIL MODAL */}

            <DetailModal
                item={selectedItem}
                title={currentResource.label}
                onClose={() => setSelectedItem(null)}
            />

        </div>
    );
}

export default App;