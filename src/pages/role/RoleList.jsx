import React from 'react';

const RoleList = ({ roles }) => (
  <div style={styles.roleList}>
    <h2>Existing Roles</h2>
    {roles.length > 0 ? (
      <ul>
        {roles.map((role) => (
          <li key={role.id} style={styles.roleItem}>
            {role.name}
          </li>
        ))}
      </ul>
    ) : (
      <p>No roles found.</p>
    )}
  </div>
);

const styles = {
  roleList: {
    marginTop: '2rem',
    padding: '1rem',
    background: '#f9f9f9',
    borderRadius: '8px',
  },
  roleItem: {
    padding: '0.5rem 0',
    borderBottom: '1px solid #ddd',
  },
};

export default RoleList;
