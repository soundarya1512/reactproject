import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../css/Index.css";
import "../../css/Form.css";
import { Select } from 'antd';
import { addUser , getRoles, assignRoleToUser } from '../../helpers/apiHelper';  // Import the addUsers function


const AddUser = () => {

  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roles, setRoles] = useState([]);
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

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roleList = await getRoles();
        setRoles(Array.isArray(roleList) ? roleList : []);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
  
    fetchRoles();
  }, []);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };

 
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Selected Roles during submit:", selectedRole);
  
    const userPayload = {
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
  
    console.log('Payload being sent:', userPayload);
  
    try {
      const newUser = await addUser(userPayload);
      const userId = newUser?.id;
  
      if (!userId) {
        setMessage("User creation failed. No ID returned.");
        return;
      }
  
      const selectedRoleNames = roles
        .filter(role => selectedRole.includes(role.id))
        .map(role => role.name);

        console.log("User ID:", userId);
console.log("Selected Roles:", selectedRole);
  
    
      if (userId) {
        const assignResponse = await assignRoleToUser(userId, selectedRole);
        console.log("Role assignment response:", assignResponse);
  
        // toast.success("User added and role assigned successfully!");
        navigate("/users");
      } else {
        toast.error("Failed to retrieve user ID");
      }
      
    } catch (error) {
      console.error("Error creating user or assigning roles:", error);
      setMessage("Something went wrong while creating the user.");
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
              <label className="form-label">Role</label>
             

<Select
        mode="multiple"
        placeholder="Select Role(s)"
        value={selectedRole}
        onChange={setSelectedRole}
        options={roles.map(r => ({ label: r.name, value: r.id }))}
        style={{ width: '50%' }}
        disabled={loading}
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