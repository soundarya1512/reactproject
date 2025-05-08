import React, { useEffect, useState } from 'react';
import {
  getRoles,
  createRole,
  getUsers,
  assignRoleToUser,
  getPermissions,
  assignPermissionsToRole
} from 'helpers/apiHelper';

import CreateRoleForm from './CreateRoleForm';
import AssignRoleForm from './AssignRoleForm';
import AssignPermissionForm from './AssignPermissionForm';

import RoleList from './RoleList';
const RolePage = () => {
  const [roleName, setRoleName] = useState('');
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [selectedRoleForPermission, setSelectedRoleForPermission] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    loadRoles();
    loadUsers();
    loadPermissions();
  }, []);

  const loadRoles = async () => {
    const rolesData = await getRoles();
    setRoles(Array.isArray(rolesData) ? rolesData : []);
  };

  const loadUsers = async () => {
    const usersData = await getUsers();
    setUsers(Array.isArray(usersData) ? usersData : []);
  };

  const loadPermissions = async () => {
    const permissionsData = await getPermissions();
    setPermissions(Array.isArray(permissionsData) ? permissionsData : []);
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    await createRole(roleName);
    setRoleName('');
    loadRoles();
  };

  const handleAssignRole = async (e) => {
    e.preventDefault();
    await assignRoleToUser(selectedUser, selectedRole);
    setSelectedUser('');
    setSelectedRole('');
    alert('Role assigned to user!');
  };

  const handleAssignPermissions = async (e) => {
    e.preventDefault();
    await assignPermissionsToRole(selectedRoleForPermission, selectedPermissions);
    setSelectedPermissions([]);
    setSelectedRoleForPermission('');
    alert('Permissions assigned to role!');
  };

  const handlePermissionChange = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Role Management</h1>

      <CreateRoleForm
        roleName={roleName}
        setRoleName={setRoleName}
        handleCreateRole={handleCreateRole}
      />
      <RoleList roles={roles} />

      <AssignRoleForm
        users={users}
        roles={roles}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        handleAssignRole={handleAssignRole}
      />

      <AssignPermissionForm
        roles={roles}
        permissions={permissions}
        selectedRoleForPermission={selectedRoleForPermission}
        setSelectedRoleForPermission={setSelectedRoleForPermission}
        selectedPermissions={selectedPermissions}
        handlePermissionChange={handlePermissionChange}
        handleAssignPermissions={handleAssignPermissions}
      />
    </div>
  );
};

export default RolePage;
