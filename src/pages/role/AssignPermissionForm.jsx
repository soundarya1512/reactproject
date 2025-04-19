import React from 'react';

const AssignPermissionForm = ({
  roles,
  permissions,
  selectedRoleForPermission,
  setSelectedRoleForPermission,
  selectedPermissions,
  handlePermissionChange,
  handleAssignPermissions
}) => (
  <form onSubmit={handleAssignPermissions}>
    <h2>Assign Permissions to Role</h2>
    <select
      value={selectedRoleForPermission}
      onChange={(e) => setSelectedRoleForPermission(e.target.value)}
      required
    >
      <option value="">Select Role</option>
      {roles.map((role) => (
        <option key={role.id} value={role.id}>
          {role.name}
        </option>
      ))}
    </select>
    <div style={{ maxHeight: 200, overflowY: 'scroll', margin: '1rem 0' }}>
      {permissions.map((perm) => (
        <label key={perm.id} style={{ display: 'block' }}>
          <input
            type="checkbox"
            value={perm.id}
            checked={selectedPermissions.includes(perm.id)}
            onChange={() => handlePermissionChange(perm.id)}
          />
          {perm.name}
        </label>
      ))}
    </div>
    <button type="submit">Assign Permissions</button>
  </form>
);

export default AssignPermissionForm;
