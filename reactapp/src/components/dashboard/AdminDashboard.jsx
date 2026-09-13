import React, { useState, useEffect } from 'react';
import Card from '../base/Card';
import Button from '../base/Button';
import Badge from '../base/Badge';
import Stats from '../base/Stats';
import Table from '../base/Table';
import Modal from '../base/Modal';
import FormField from '../base/Form';
import { getUsers, updateUserRole, deactivateUser, reactivateUser, getPlatformMetrics } from '../../services/adminService';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersRes, metricsRes] = await Promise.all([
          getUsers(),
          getPlatformMetrics()
        ]);
        setUsers(usersRes.data);
        setMetrics(metricsRes.data);
      } catch (error) {
        console.error('Failed to load admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleRoleChange = async () => {
    if (!newRole || !selectedUser) return;
    try {
      await updateUserRole(selectedUser.id, newRole);
      setUsers(users.map(u => u.id === selectedUser.id ? {...u, role: newRole} : u));
      setShowRoleModal(false);
      setSelectedUser(null);
      setNewRole('');
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const handleDeactivate = async (userId) => {
    if (window.confirm('Deactivate this user?')) {
      try {
        await deactivateUser(userId);
        setUsers(users.map(u => u.id === userId ? {...u, status: 'Inactive'} : u));
      } catch (error) {
        console.error('Failed to deactivate user:', error);
      }
    }
  };

  const handleReactivate = async (userId) => {
    try {
      await reactivateUser(userId);
      setUsers(users.map(u => u.id === userId ? {...u, status: 'Active'} : u));
    } catch (error) {
      console.error('Failed to reactivate user:', error);
    }
  };

  const tableColumns = [
    { key: 'name', label: 'User Name', width: '15%' },
    { key: 'email', label: 'Email', width: '20%' },
    { key: 'role', label: 'Role', width: '15%' },
    { key: 'status', label: 'Status', width: '12%' },
    { key: 'joinDate', label: 'Join Date', width: '15%' },
    { key: 'lastLogin', label: 'Last Login', width: '15%' },
    { key: 'actions', label: 'Actions', width: '8%' }
  ];

  const tableData = users.map(user => ({
    ...user,
    role: <Badge variant={user.role === 'ADMIN' ? 'danger' : 'primary'}>{user.role}</Badge>,
    status: <Badge variant={user.status === 'Active' ? 'success' : 'warning'}>{user.status}</Badge>,
    joinDate: new Date(user.joinedAt).toLocaleDateString(),
    lastLogin: new Date(user.lastLogin).toLocaleDateString(),
    actions: (
      <div style={{ display: 'flex', gap: '6px' }}>
        <Button 
          size="small" 
          variant="ghost" 
          onClick={() => {
            setSelectedUser(user);
            setNewRole(user.role);
            setShowRoleModal(true);
          }}
        >
          Edit Role
        </Button>
        {user.status === 'Active' ? (
          <Button size="small" variant="danger" onClick={() => handleDeactivate(user.id)}>
            Deactivate
          </Button>
        ) : (
          <Button size="small" variant="success" onClick={() => handleReactivate(user.id)}>
            Reactivate
          </Button>
        )}
      </div>
    )
  }));

  if (loading) {
    return <div style={{ padding: '20px', color: 'var(--text)' }}>Loading admin dashboard...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: 'var(--text)', marginBottom: '20px' }}>Admin Dashboard</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border)' }}>
        {['overview', 'users', 'config'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: activeTab === tab ? 'var(--accent)' : 'transparent',
              color: activeTab === tab ? 'white' : 'var(--text)',
              cursor: 'pointer',
              fontSize: '14px',
              borderBottom: activeTab === tab ? '2px solid var(--accent)' : 'none'
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && metrics && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            <Stats
              title="Total Users"
              value={metrics.totalUsers}
              icon="👥"
              subtitle="Active platform users"
            />
            <Stats
              title="Total Applications"
              value={metrics.totalApplications?.toLocaleString()}
              icon="📄"
              subtitle="Submitted applications"
            />
            <Stats
              title="Conversion Rate"
              value={`${metrics.conversionRate}%`}
              icon="📈"
              subtitle="App to offer ratio"
            />
            <Stats
              title="Platform Uptime"
              value="99.99%"
              icon="✅"
              subtitle="System stability"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '16px' }}>
            <Card title="User Distribution by Role">
              <div style={{ padding: '12px 0' }}>
                {Object.entries(metrics.usersByRole || {}).map(([role, count]) => (
                  <div key={role} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text)' }}>{role}</span>
                    <Badge variant={role === 'ADMIN' ? 'danger' : 'primary'}>{count}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Application Statistics">
              <div style={{ padding: '12px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text)' }}>Pending Review</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>
                    {metrics.applicationStats?.pending || 0}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text)' }}>Interviews Scheduled</span>
                  <span style={{ fontWeight: 'bold', color: '#82ca9d' }}>
                    {metrics.applicationStats?.scheduled || 0}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px' }}>
                  <span style={{ color: 'var(--text)' }}>Offers Made</span>
                  <span style={{ fontWeight: 'bold', color: '#ffc658' }}>
                    {metrics.applicationStats?.offers || 0}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ color: 'var(--text)', marginBottom: '12px' }}>User Management</h2>
            <p style={{ color: 'var(--text)', opacity: 0.7, marginBottom: '16px' }}>
              Manage user accounts, roles, and access
            </p>
          </div>
          <Table
            columns={tableColumns}
            data={tableData}
            searchable={true}
            sortable={true}
            pageSize={10}
          />
        </div>
      )}

      {/* Configuration Tab */}
      {activeTab === 'config' && (
        <div style={{ maxWidth: '600px' }}>
          <Card title="System Configuration">
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text)', fontWeight: 'bold' }}>
                  Feature Toggles
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { name: 'Premium Features', enabled: true },
                    { name: 'Career Counselor Panel', enabled: true },
                    { name: 'Direct Messaging', enabled: false },
                    { name: 'Video Interviews', enabled: true }
                  ].map(feature => (
                    <div key={feature.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text)' }}>{feature.name}</span>
                      <input 
                        type="checkbox" 
                        defaultChecked={feature.enabled}
                        style={{ cursor: 'pointer', width: '20px', height: '20px' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text)', fontWeight: 'bold' }}>
                  System Maintenance
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="secondary" size="small">Clear Cache</Button>
                  <Button variant="secondary" size="small">Restart Services</Button>
                  <Button variant="danger" size="small">Emergency Shutdown</Button>
                </div>
              </div>

              <div style={{ marginBottom: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text)', fontWeight: 'bold' }}>
                  Notification Broadcast
                </label>
                <FormField>
                  <textarea 
                    placeholder="Send system-wide announcement"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid var(--border)',
                      borderRadius: '4px',
                      color: 'var(--text)',
                      backgroundColor: 'var(--bg)',
                      minHeight: '80px'
                    }}
                  />
                </FormField>
                <Button variant="primary" size="small" style={{ marginTop: '8px' }}>
                  Broadcast
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Role Modal */}
      {showRoleModal && selectedUser && (
        <Modal
          title="Update User Role"
          onClose={() => setShowRoleModal(false)}
        >
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text)', fontWeight: 'bold' }}>
                User: {selectedUser.name}
              </label>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text)', fontWeight: 'bold' }}>
                New Role
              </label>
              <select
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  color: 'var(--text)',
                  backgroundColor: 'var(--bg)',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select role...</option>
                <option value="STANDARD_CANDIDATE">Standard Candidate</option>
                <option value="PREMIUM_CANDIDATE">Premium Candidate</option>
                <option value="CAREER_COUNSELOR">Career Counselor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button variant="ghost" onClick={() => setShowRoleModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleRoleChange}>
                Update Role
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
