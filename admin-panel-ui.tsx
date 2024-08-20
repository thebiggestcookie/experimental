import React, { useState, useEffect } from 'react';
import { ChartPieIcon, UsersIcon, CogIcon, FolderTreeIcon, BoltIcon, ChartBarIcon } from 'lucide-react';

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [llmProviders, setLlmProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeSection]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeSection) {
        case 'users':
          const usersResponse = await fetch('/api/users');
          const usersData = await usersResponse.json();
          setUsers(usersData);
          break;
        case 'llm':
          const llmResponse = await fetch('/api/llm-providers');
          const llmData = await llmResponse.json();
          setLlmProviders(llmData);
          break;
        case 'categories':
          const categoriesResponse = await fetch('/api/categories');
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
          break;
        // Add more cases for other sections as needed
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement users={users} />;
      case 'llm':
        return <LLMConfiguration providers={llmProviders} />;
      case 'settings':
        return <SystemSettings />;
      case 'categories':
        return <CategoryHierarchy categories={categories} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
        <nav>
          <SidebarItem icon={<ChartPieIcon />} text="Dashboard" onClick={() => setActiveSection('dashboard')} active={activeSection === 'dashboard'} />
          <SidebarItem icon={<UsersIcon />} text="User Management" onClick={() => setActiveSection('users')} active={activeSection === 'users'} />
          <SidebarItem icon={<BoltIcon />} text="LLM Configuration" onClick={() => setActiveSection('llm')} active={activeSection === 'llm'} />
          <SidebarItem icon={<CogIcon />} text="System Settings" onClick={() => setActiveSection('settings')} active={activeSection === 'settings'} />
          <SidebarItem icon={<FolderTreeIcon />} text="Category Hierarchy" onClick={() => setActiveSection('categories')} active={activeSection === 'categories'} />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {loading ? <div>Loading...</div> : renderContent()}
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, onClick, active }) => (
  <div
    className={`flex items-center p-2 rounded-md cursor-pointer ${active ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
    onClick={onClick}
  >
    {icon}
    <span className="ml-2">{text}</span>
  </div>
);

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/dashboard-metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
    }
  };

  if (!metrics) {
    return <div>Loading dashboard metrics...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard title="System Health">
          <div className="flex justify-between">
            <div>CPU Usage: {metrics.cpuUsage}%</div>
            <div>Memory: {metrics.memoryUsage} / {metrics.totalMemory} GB</div>
          </div>
        </DashboardCard>
        <DashboardCard title="Active Users">
          <div className="text-3xl font-bold">{metrics.activeUsers}</div>
        </DashboardCard>
        <DashboardCard title="Products Processed (24h)">
          <div className="text-3xl font-bold">{metrics.productsProcessed24h}</div>
        </DashboardCard>
      </div>
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton text="Add User" onClick={() => {/* Implement add user functionality */}} />
          <QuickActionButton text="Generate Report" onClick={() => {/* Implement report generation */}} />
          <QuickActionButton text="Update LLM Config" onClick={() => {/* Implement LLM config update */}} />
          <QuickActionButton text="View Logs" onClick={() => {/* Implement log viewing */}} />
        </div>
      </div>
    </div>
  );
};

const UserManagement = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search users..."
            className="p-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Add User</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Username</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="p-2">{user.username}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">
                  <button className="text-blue-500 mr-2" onClick={() => {/* Implement edit user */}}>Edit</button>
                  <button className="text-red-500" onClick={() => {/* Implement delete user */}}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const LLMConfiguration = ({ providers }) => {
  const [selectedProvider, setSelectedProvider] = useState(providers[0]?.id || '');
  const [model, setModel] = useState('');
  const [maxTokens, setMaxTokens] = useState('');

  const handleSaveConfiguration = async () => {
    try {
      const response = await fetch('/api/llm-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          providerId: selectedProvider,
          model,
          maxTokens: parseInt(maxTokens),
        }),
      });
      if (response.ok) {
        alert('LLM Configuration saved successfully');
      } else {
        throw new Error('Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving LLM configuration:', error);
      alert('Failed to save LLM configuration');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">LLM Configuration</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-xl font-bold mb-2">Provider List</h3>
          <ul>
            {providers.map((provider) => (
              <li key={provider.id} className="mb-2">{provider.name}</li>
            ))}
          </ul>
          <button className="bg-green-500 text-white px-4 py-2 rounded mt-4">Add Provider</button>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-xl font-bold mb-2">Model Configurator</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleSaveConfiguration(); }}>
            <div className="mb-4">
              <label className="block mb-2">Provider</label>
              <select
                className="w-full p-2 border rounded"
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
              >
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>{provider.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">Model</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="gpt-3.5-turbo"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Max Tokens</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                placeholder="2048"
                value={maxTokens}
                onChange={(e) => setMaxTokens(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save Configuration</button>
          </form>
        </div>
      </div>
    </div>
  );
};

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    systemName: '',
    defaultLanguage: 'en',
    timezone: 'UTC',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/system-settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching system settings:', error);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/system-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      if (response.ok) {
        alert('Settings saved successfully');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving system settings:', error);
      alert('Failed to save settings');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">System Settings</h2>
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-xl font-bold mb-4">General Settings</h3>
        <form onSubmit={(e) => { e.preventDefault(); handleSaveSettings(); }}>
          <div className="mb-4">
            <label className="block mb-2">System Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={settings.systemName}
              onChange={(e) => handleSettingChange('systemName', e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Default Language</label>
            <select
              className="w-full p-2 border rounded"
              value={settings.defaultLanguage}
              onChange={(e) => handleSettingChange('defaultLanguage', e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Timezone</label>
            <select
              className="w-full p-2 border rounded"
              value={settings.timezone}
              onChange={(e) => handleSettingChange('timezone', e.target.value)}
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Europe/London">Europe/London</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save Settings</button>
        </form>
      </div>
    </div>
  );
};

const CategoryHierarchy = ({ categories }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const renderCategoryTree = (category, depth = 0) => (
    <div key={category.id} style={{ marginLeft: `${depth * 20}px` }}>
      <span
        className="cursor-pointer hover:text-blue-500"
        onClick={() => setSelectedCategory(category)}
      >
        {category.name}
      </span>
      {category.children && category.children.map(child => renderCategoryTree(child, depth + 1))}
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Category Hierarchy</h2>
      <div className="flex">
        <div className="w-1/3 bg-white rounded-lg shadow p-4 mr-4">
          <h3 className="text-xl font-bold mb-2">Hierarchy Tree</h3>
          {categories.map(category => renderCategoryTree(category))}
        </div>
        <div className="w-2/3 bg-white rounded-lg shadow p-4">
          <h3 className="text-xl font-bold mb-2">Category Editor</h3>
          {selectedCategory ? (
            <form onSubmit={(e) => { e.preventDefault(); /* Implement save category */ }}>
              <div className="mb-4">
                <label className="block mb-2">Category Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={selectedCategory.name}
                  onChange={(e) => setSelectedCategory({ ...selectedCategory, name: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Parent Category</label>
                <select
                  className="w-full p-2 border rounded"
                  value={selectedCategory.parentId || ''}
                  onChange={(e) => setSelectedCategory({ ...selectedCategory, parentId: e.target.value })}
                >
                  <option value="">None (Top Level)</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save Category</button>
            </form>
          ) : (
            <p>Select a category to edit or create a new one.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    {children}
  </div>
);

const QuickActionButton = ({ text, onClick }) => (
  <button className="bg-blue-500 text-white p-2 rounded w-full" onClick={onClick}>{text}</button>
);

export default AdminPanel;
