import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../css/Index.css";
import "../../css/Form.css";
import { addUser } from '../../helpers/apiHelper';  // Import the addUsers function

const AddUser = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    status: '',
    super_user: '',
    username: '',
    date_joined: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   const allInputValue = {
  //     first_name: formData.first_name,
  //     last_name: formData.last_name,
  //     username: formData.username,
  //     email: formData.email,
  //     phone_number: formData.phone_number,
  //     password: formData.password,
  //     is_active: formData.status === 'true',
  //     is_superuser: formData.super_user === 'true',
  //     date_joined: formData.date_joined,
  //   };
  
  //   // Show form data in an alert
  //      // Pretty printed JSON
  
  //   // If needed, continue with your API call or logic here
  //   // await addUsers(allInputValue);
  //   // navigate("/user-list"); // or wherever you want to go
  // };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const allInputValue = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      username: formData.username,
      email: formData.email,
      phone_number: formData.phone_number,
      password: formData.password,
      is_active: formData.status === 'true',
      is_superuser: formData.super_user === 'true',
      date_joined: formData.date_joined,
    };
    alert(JSON.stringify(allInputValue, null, 2));  // Pretty printed JSON
    const result = await addUser(allInputValue);
    console.log(allInputValue);
    if (result) {
      setMessage('User created successfully!');
      navigate('/users');
    } else {
      setMessage('Failed to create user. Please check the input.');
    }
  };

  
  const isFormValid = formData.first_name && formData.last_name && formData.email && formData.password;

  return (
    <div className="role-table-container">
      <div className="role-table-header">
        <h2>Create User</h2>
        <button onClick={() => window.history.back()} className="add-role-button">Back</button>
      </div>

      <form className="form-wrapper" onSubmit={handleSubmit}>
        <div className="row">
          {/* Form fields */}
          <div className="form-group col-6">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="input-role-name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group col-6">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="input-role-name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group col-6">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="input-role-name"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group col-6">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="input-role-name"
              name="username"
              value={formData.username}
              onChange={handleChange}
              
            />
          </div>
          <div className="form-group col-6">
            <label className="form-label">Phone</label>
            <input
              type="number"
              className="input-role-name"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-6">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="input-role-name"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-6 mb-3">
            <label className="form-label">Date Of Joined</label>
            <input
              type="datetime-local"
              className="form-control"
              name="date_joined"
              value={formData.date_joined}
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-6">
            <label className="form-label">Status</label><br />
            <input
              type="radio"
              className="status"
              name="status"
              value="true"
              checked
              onChange={handleChange}
            /> Active&nbsp;
            <input
              type="radio"
              className="status"
              name="status"
              value="false"
              
              onChange={handleChange}
            /> Inactive
          </div>

          <div className="form-group col-6">
            <label className="form-label">Super User</label><br />
            <input
              type="radio"
              className="super_user"
              name="super_user"
              value="true"
             
              onChange={handleChange}
            /> Active&nbsp;
            <input
              type="radio"
              className="super_user"
              name="super_user"
              value="false"
              checked
              onChange={handleChange}
            /> Inactive
          </div>

        </div>

        <div className="form-buttons">
          <button
            type="submit"
            className="add-role-button btn-width"
            disabled={!isFormValid}
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="add-role-button back-btn"
          >
            Back
          </button>
        </div>
      </form>

      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default AddUser;