import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, updateUser, getRoles, getUserRole, assignRoleToUser  } from '../../helpers/apiHelper';
import "../../css/Index.css";
import "../../css/Form.css";
import { Select } from 'antd';
// import { json } from 'stream/consumers';

const EditUser = () => {
  const { id } = useParams(); // Extract user ID from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    phone_number: '',
    password: '',
    date_joined: '',
    status: '',
    super_user: ''
  });

  const [message, setMessage] = useState('');
  const [isFormValid, setIsFormValid] = useState(true);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState([]);
  

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserById(id);
        if (user) {
          setFormData({
            ...user,
            status: user.is_active,
            super_user: user.is_superuser,
            date_joined: user.date_joined ? new Date(user.date_joined).toISOString().slice(0, 16) : ''
          });
        }
  
        const roleList = await getRoles();
        setRoles(roleList);
  
        const userRoleRes = await getUserRole(id); // returns { groups: ['Sub Admin', 'New User'] }
        const selectedRoles = roleList
          .filter(role => userRoleRes.groups.includes(role.name)) // Match role names
          .map(role => role.id); // Convert to IDs for Select
  
        setSelectedRole(selectedRoles); // This makes roles appear selected in the dropdown
  console.log(selectedRoles);
      } catch (error) {
        console.error("Error loading user roles:", error);
      }
    };
  
    fetchData();
  }, [id]);
    


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === "true" ? true : value === "false" ? false : value // Convert to boolean if needed
    });
  };
  
 
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Build payload without status and super_user
      const {
        status,
        super_user,
        ...cleanData
      } = formData;
  
      const payload = {
        ...cleanData,
        is_active: status,
        is_superuser: super_user
      };
  
      console.log("Payload to submit:", payload);
  
      // Update user basic info
      await updateUser(id, payload);
  
      // Update user roles
      // await updateUserRole(id, { groups: selectedRole }); // selectedRole is an array of role IDs
   const assignResponse = await assignRoleToUser(id, selectedRole);
     console.log("Role assignment response:", assignResponse);
  
      setMessage('User updated successfully!');
      setTimeout(() => navigate('/users'), 1000);
    } catch (error) {
      console.error("Update failed:", error);
      setMessage('Failed to update user');
    }
  };
  
  

  return (
    <div className="role-table-container">
      <div className="role-table-header">
        <h2>Edit User</h2>
        <button onClick={() => window.history.back()} className="add-role-button">Back</button>
      </div>

      <form className="form-wrapper" onSubmit={handleSubmit}>
        <div className="row">
          {/* Form fields */}
          <div className="form-group col-6">
            <label className="form-label">First Name</label>
            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="input-role-name" required />
          </div>
          <div className="form-group col-6">
            <label className="form-label">Last Name</label>
            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="input-role-name" required />
          </div>
          <div className="form-group col-6">
            <label className="form-label">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-role-name" required />
          </div>
          <div className="form-group col-6">
            <label className="form-label">Role</label>
            {/* <Select mode="multiple" placeholder="Select Role(s)" value={selectedRole} onChange={setSelectedRole} options={roles.map(r => ({ label: r.name, value: r.id }))} style={{ width: '100%' }} /> */}

            <Select
  mode="multiple"
  placeholder="Select Role(s)"
  value={selectedRole}
  onChange={setSelectedRole}
  options={roles.map(role => ({ label: role.name, value: role.id }))}
  style={{ width: '50%' }}
/>

          </div>



          <div className="form-group col-6">
            <label className="form-label">Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} className="input-role-name" required />
          </div>
          <div className="form-group col-6">
            <label className="form-label">Phone</label>
            <input type="number" name="phone_number" value={formData.phone_number} onChange={handleChange} className="input-role-name" />
          </div>
          <div className="form-group col-6">
            <label className="form-label">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-role-name" required />
          </div>
          <div className="col-6 mb-3">
            <label className="form-label">Date Of Joined</label>
            <input type="datetime-local" name="date_joined" value={formData.date_joined} onChange={handleChange} className="form-control" />
          </div>
        

          <div className="form-group col-6">
            <label className="form-label">Status</label><br />
            <input 
              type="radio" 
              name="status" 
              value={true}  // Use boolean value true
              checked={formData.status === true}  // Compare with boolean true
              onChange={handleChange} 
            /> Active&nbsp;
            <input 
              type="radio" 
              name="status" 
              value={false}  // Use boolean value false
              checked={formData.status === false}  // Compare with boolean false
              onChange={handleChange} 
            /> Inactive
          </div>
          <div className="form-group col-6">
            <label className="form-label">Super Admin</label><br />
            <input 
              type="radio" 
              name="super_user" 
              value={true}  // Use boolean value true
              checked={formData.super_user === true}  // Compare with boolean true
              onChange={handleChange} 
            /> Active&nbsp;
            <input 
              type="radio" 
              name="super_user" 
              value={false}  // Use boolean value false
              checked={formData.super_user === false}  // Compare with boolean false
              onChange={handleChange} 
            /> Inactive
          </div>

        </div>

        <div className="form-buttons">
          <button type="submit" className="add-role-button btn-width" disabled={!isFormValid}>Update</button>
          <button type="button" onClick={() => window.history.back()} className="add-role-button back-btn">Back</button>
        </div>
      </form>

      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default EditUser;