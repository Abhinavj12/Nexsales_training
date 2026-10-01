import React, { useState } from "react";
import {
  Container,
  Card,
  Form,
  Button
} from "react-bootstrap";

const ApplicationForm = ({ onSubmit }) => {

  // useState to store all form data
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    email: "",
    gender: "",
    subjects: [],
    birthdate: ""
  });

  // Handle input changes
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle checkbox changes
  const handleSubjectChange = (e) => {

    const { value, checked } = e.target;

    if (checked) {

      setFormData({
        ...formData,
        subjects: [...formData.subjects, value]
      });

    } else {

      setFormData({
        ...formData,
        subjects: formData.subjects.filter(
          (subject) => subject !== value
        )
      });

    }
  };

  // Handle form submit
  const handleFormSubmit = (e) => {

    e.preventDefault();

    // Send formData to parent using props
    onSubmit(formData);
  };

  // Handle cancel
  const handleCancel = () => {

    setFormData({
      name: "",
      address: "",
      city: "",
      email: "",
      gender: "",
      subjects: [],
      birthdate: ""
    });
  };

  return (
    <Container className="d-flex justify-content-center mt-5">

      <Card
        className="p-4 shadow-sm"
        style={{ width: "450px" }}
      >

        <h1 className="mb-4">
          Application Form
        </h1>

        <Form onSubmit={handleFormSubmit}>

          {/* Name */}
          <Form.Group className="mb-3">

            <Form.Label>
              Name
            </Form.Label>

            <Form.Control
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
            />

          </Form.Group>


          {/* Address */}
          <Form.Group className="mb-3">

            <Form.Label>
              Address
            </Form.Label>

            <Form.Control
              type="text"
              name="address"
              placeholder="Enter Address"
              value={formData.address}
              onChange={handleChange}
            />

          </Form.Group>


          {/* City */}
          <Form.Group className="mb-3">

            <Form.Label>
              City
            </Form.Label>

            <Form.Select
              name="city"
              value={formData.city}
              onChange={handleChange}
            >

              <option value="">
                Select Your City
              </option>

              <option value="Mumbai">
                Mumbai
              </option>

              <option value="Delhi">
                Delhi
              </option>

              <option value="Pune">
                Pune
              </option>

              <option value="Bangalore">
                Bangalore
              </option>

            </Form.Select>

          </Form.Group>


          {/* Email */}
          <Form.Group className="mb-3">

            <Form.Label>
              Email
            </Form.Label>

            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />

          </Form.Group>


          {/* Gender */}
          <Form.Group className="mb-3">

            <Form.Label className="me-3">
              Gender
            </Form.Label>

            <Form.Check
              inline
              type="radio"
              label="Male"
              name="gender"
              value="Male"
              checked={formData.gender === "Male"}
              onChange={handleChange}
            />

            <Form.Check
              inline
              type="radio"
              label="Female"
              name="gender"
              value="Female"
              checked={formData.gender === "Female"}
              onChange={handleChange}
            />

          </Form.Group>


          {/* Subject */}
          <Form.Group className="mb-3">

            <Form.Label>
              Subject
            </Form.Label>

            <div>

              <Form.Check
                inline
                type="checkbox"
                label="C"
                value="C"
                checked={formData.subjects.includes("C")}
                onChange={handleSubjectChange}
              />

              <Form.Check
                inline
                type="checkbox"
                label="C++"
                value="C++"
                checked={formData.subjects.includes("C++")}
                onChange={handleSubjectChange}
              />

              <Form.Check
                inline
                type="checkbox"
                label="Java"
                value="Java"
                checked={formData.subjects.includes("Java")}
                onChange={handleSubjectChange}
              />

              <Form.Check
                inline
                type="checkbox"
                label="Python"
                value="Python"
                checked={formData.subjects.includes("Python")}
                onChange={handleSubjectChange}
              />

            </div>

          </Form.Group>


          {/* Birthdate */}
          <Form.Group className="mb-4">

            <Form.Label>
              Select Your Birthdate
            </Form.Label>

            <Form.Control
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
            />

          </Form.Group>


          {/* Buttons */}
          <div className="d-flex justify-content-center gap-4">

            <Button
              variant="primary"
              type="submit"
            >
              Submit
            </Button>

            <Button
              variant="danger"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </Button>

          </div>

        </Form>

      </Card>

    </Container>
  );
};

export default ApplicationForm;