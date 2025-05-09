import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRole, getPermissions } from '../../helpers/apiHelper';
import './RoleTable.css';
import './NameForm.css';

const AddRoleForm = () => {
  const [name, setName] = useState('');
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const perms = await getPermissions();
        const grouped = perms.reduce((acc, p) => {
          const cat = p.content_type__model;
          acc[cat] = acc[cat] || [];
          acc[cat].push(p);
          return acc;
        }, {});
        setPermissions(grouped);
      } catch (e) {
        console.error('Fetch perms error', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCheckboxChange = (cat, code, e) => {
    const checked = e.target.checked;
    setPermissions(prev => ({
      ...prev,
      [cat]: prev[cat].map(p =>
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

    const created = await createRole(payload);
    if (created) navigate('/role');
  };


  
  return (
    <div className="role-table-container">
      <div className="role-table-header">
        <h2>Add Roles</h2>
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

        <div className="row">
          {Object.keys(permissions).map(cat => (
            <div className="form-group col-6" key={cat}>
              <label className="form-label">
                {cat.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}:
              </label>
              <div className="checkbox-group">
                {['add', 'change', 'view', 'delete'].map(action => {
                  const p = permissions[cat].find(p => p.codename.startsWith(action));
                  if (!p) return null;
                  return (
                    <div className="checkbox-wrapper" key={p.codename}>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={p.checked || false}
                          onChange={e => handleCheckboxChange(cat, p.codename, e)}
                        />
                        {action === 'change' ? 'Edit' : action.charAt(0).toUpperCase() + action.slice(1)}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="form-buttons">
          <button type="submit" className="add-role-button btn-width">Submit</button>
          <button type="button" onClick={() => window.history.back()} className="add-role-button back-btn">
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRoleForm;
