import React from 'react';

const AssignRoleForm = ({ users, roles, selectedUser, setSelectedUser, selectedRole, setSelectedRole, handleAssignRole }) => (
  <form onSubmit={handleAssignRole} style={{ marginBottom: '2rem' }}>
    <h2>Assign Role to User</h2>
    <select
      value={selectedUser}
      onChange={(e) => setSelectedUser(e.target.value)}
      required
    >
      <option value="">Select User</option>
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.username}
        </option>
      ))}
    </select>
    <select
      value={selectedRole}
      onChange={(e) => setSelectedRole(e.target.value)}
      required
    >
      <option value="">Select Role</option>
      {roles.map((role) => (
        <option key={role.id} value={role.id}>
          {role.name}
        </option>
      ))}
    </select>
    <button type="submit">Assign Role</button>
  </form>
);

export default AssignRoleForm;
