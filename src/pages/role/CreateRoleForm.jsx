import React from 'react';

const CreateRoleForm = ({ roleName, setRoleName, handleCreateRole }) => (
  <form onSubmit={handleCreateRole} style={{ marginBottom: '2rem' }}>
    <h2>Create New Role</h2>
    <input
      type="text"
      value={roleName}
      onChange={(e) => setRoleName(e.target.value)}
      placeholder="Enter role name"
      required
      style={{
        width: '100%',
        padding: '0.5rem',
        marginBottom: '1rem',
        border: '1px solid #ccc',
        borderRadius: '6px'
      }}
    />
    <button
      type="submit"
      style={{
        padding: '0.5rem 1rem',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
      }}
    >
      Create Role
    </button>
  </form>
);

export default CreateRoleForm;
