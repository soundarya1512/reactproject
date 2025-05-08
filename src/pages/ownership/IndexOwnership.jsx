import React, { useEffect, useState } from 'react';
// import { getRoles, deleteRole } from '../../helpers/apiHelper';
import './RoleTable.css';
import { useNavigate } from "react-router-dom";

export default function index-ownership() {
  return (
    <div>index-ownership</div>
  )
}
// pages/role/index.jsx
import React, { useEffect, useState } from 'react';
import { getRoles, deleteRole } from '../../helpers/apiHelper';
import './RoleTable.css';
import { useNavigate } from "react-router-dom";

const IndexOwnership = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rolesPerPage] = useState(10); // Show 5 roles per page

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getRoles();
        setRoles(data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    fetchRoles();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-role/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      const response = await deleteRole(id);
      if (response.success) {
        alert('Role deleted successfully!');
        setRoles(roles.filter(role => role.id !== id));
      } else {
        alert('Failed to delete role');
      }
    }
  };

  const handleAddRoleClick = () => {
    navigate("/add-role");
  };

  // Pagination logic
  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = roles.slice(indexOfFirstRole, indexOfLastRole);
  const totalPages = Math.ceil(roles.length / rolesPerPage);

  return (
    <div className="role-table-container">
      <div className="role-table-header">
        <h2>Roles List</h2>
        <button className="add-role-button" onClick={handleAddRoleClick}>+ Add Role</button>
      </div>

      <table className="role-table">
        <thead>
          <tr>
            <th>Role ID</th>
            <th>Role Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRoles.map(role => (
            <tr key={role.id}>
              <td>{role.id}</td>
              <td>{role.name}</td>
              <td>
                <button className="action-btn edit-btn" onClick={() => handleEdit(role.id)}>Edit</button>
                <button className="action-btn delete-btn" onClick={() => handleDelete(role.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
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

export default IndexOwnership;
