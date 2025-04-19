import React, { useEffect, useState } from 'react';
import { createRole, getRoles } from 'helpers/apiHelper';
import CreateRoleForm from './CreateRoleForm';
import RoleList from './RoleList';

const RoleCreatePage = () => {
  const [roleName, setRoleName] = useState('');
  const [roles, setRoles] = useState([]);

  const fetchRoles = async () => {
    const data = await getRoles();
    setRoles(data);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!roleName) return;
    const result = await createRole(roleName);
    if (result) {
      alert(`Role "${roleName}" created!`);
      setRoleName('');
      fetchRoles();
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Role Management</h1>
      <CreateRoleForm
        roleName={roleName}
        setRoleName={setRoleName}
        handleCreateRole={handleCreateRole}
      />
      <RoleList roles={roles} />
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '600px',
    margin: '0 auto',
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  header: {
    marginBottom: '2rem',
    textAlign: 'center',
    color: '#333',
  }
};

export default RoleCreatePage;
