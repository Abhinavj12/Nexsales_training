import React from "react";
import ApplicationForm from "./components/ApplicationForm";

const App = () => {

  const handleSubmit = (data) => {
    console.log("Submitted Form Data:");
    console.log(data);
  };

  return (
    <ApplicationForm onSubmit={handleSubmit} />
  );
};

export default App;