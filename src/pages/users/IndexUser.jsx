import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../../helpers/apiHelper'; // ✅ import both
import "../../css/Index.css";
import { useNavigate } from "react-router-dom";

const IndexUser = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rolesPerPage] = useState(10);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        console.log("API response:", data);
        setUsers(data.results || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const indexOfLastUser = currentPage * rolesPerPage;
  const indexOfFirstUser = indexOfLastUser - rolesPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / rolesPerPage);

  const handleAddRoleClick = () => {
    navigate("/add-user");
  };

  const handleEdit = (id) => {
    navigate(`/edit-user/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const response = await deleteUser(id); // ✅ use correct function
      if (response.success) {
        alert('User deleted successfully!');
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id)); // ✅ update UI
      } else {
        alert('Failed to delete user.');
      }
    }
  };

  

  return (
    <div className="role-table-container">
      <div className="role-table-header">
        <h2>Users List</h2>
        <button className="add-role-button" onClick={handleAddRoleClick}>+ Add User</button>
      </div>

      <table className="role-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
            <th>Superuser</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                {/* <td>{user.is_active ? "ctive" : "Inactive"}</td> */}
                <td>{user.is_active === false ? "Inactive" : "Active"}</td>
                <td>{user.is_superuser === false ? "Inactive" : "Active"}</td>
                {/* <td>{user.is_superuser ? "Yes" : "No"}</td> */}
                <td>
                  <button className="action-btn edit-btn" onClick={() => handleEdit(user.id)}>Edit</button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No users found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? 'active-page' : ''}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default IndexUser;