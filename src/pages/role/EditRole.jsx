import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRoleById, getPermissions, updateRole } from '../../helpers/apiHelper';
import './RoleTable.css';
import './NameForm.css';

const EditRoleForm = () => {
  const [name, setName] = useState('');
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      try {
        const [roleData, allPermissions] = await Promise.all([
          getRoleById(id),
          getPermissions()
        ]);
  
        console.log('Fetched role data:', roleData); // ✅ You’ll see permission IDs
        setName(roleData.name);
  
        const selectedPermissionIds = roleData.permissions; // ✅ Fixed here
  
        const grouped = allPermissions.reduce((acc, p) => {
          const cat = p.content_type__model;
          const checked = selectedPermissionIds.includes(p.id); // ✅ ID match
          acc[cat] = acc[cat] || [];
          acc[cat].push({ ...p, checked });
          return acc;
        }, {});
  
        setPermissions(grouped);
      } catch (error) {
        console.error('Failed to load role or permissions:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);
  

  const handleCheckboxChange = (category, code, e) => {
    const checked = e.target.checked;
    setPermissions(prev => ({
      ...prev,
      [category]: prev[category].map(p =>
        p.codename === code ? { ...p, checked } : p
      )
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const selectedIds = Object.values(permissions)
      .flat()
      .filter(p => p.checked)
      .map(p => p.id);

    const payload = {
      name,
      permissions: selectedIds
    };

    try {
      console.log('Submitting updated role:', payload); // 👈 Log for confirmation
      alert(`Updated Role: ${name}\nPermissions: ${selectedIds.join(', ')}`); // 👈 Alert for you
      await updateRole(id, payload);
      navigate('/role');
    } catch (error) {
      alert('Error updating role. Check console for details.');
      console.error('Update error:', error);
    }
  };

  // if (loading) return <div>Loading...</div>;

  return (
    <div className="role-table-container">
      <div className="role-table-header">
        <h2>Edit Role</h2>
        <button onClick={() => window.history.back()} className="add-role-button">
          Back
        </button>
      </div>

      <form className="form-wrapper" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="roleName" className="form-label">Role Name:</label>
          <input
            id="roleName"
            type="text"
            className="input-role-name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter role name"
            required
          />
        </div>

           {Object.keys(permissions).map(cat => (
            <div className="form-group" key={cat}>
              <label className="form-label">
                {cat.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}:
              </label>
              <div className="checkbox-group">
                {permissions[cat].map(p => (
                  <label key={p.codename} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={p.checked || false}
                      onChange={e => handleCheckboxChange(cat, p.codename, e)}
                    />
                    {p.name}
                  </label>
                ))}
              </div>
            </div>
          ))}


          <div className="form-buttons">
              
              <button type="submit" className="add-role-button btn-width">Update</button>
              <button type="button" onClick={() => window.history.back()} className="add-role-button back-btn">
                Back
              </button>
            </div>
      </form>
    </div>
  );
};

export default EditRoleForm;
