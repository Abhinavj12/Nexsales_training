import React from 'react'

const Welcome=(props)=>{
  return(
    <div>
      <h1>Hello {props.name}</h1>
    </div>
  )
}

const College=({name,college,department})=>{
  return(
    <div className='college'>
      <h1>Student Details</h1>
      <h3>Student Name :{name}</h3>
      <h3>College Name :{college}</h3>
      <h3>Department Name :{department}</h3>
    </div>
  )
}

const App = () => {
  return (
    <div>
     <Welcome name="Abhinav"></Welcome>
     <Welcome name="Aditya"></Welcome>
     <Welcome name="Ayush"></Welcome>
     <College
      name="Abhinav"
      college="SAKEC"
      department="Computer Engineering"
      ></College>
    </div>
  )
}

export default App