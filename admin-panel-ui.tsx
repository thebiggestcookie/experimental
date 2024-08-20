import React, { useState } from 'react';
import { ChartPieIcon, UsersIcon, CogIcon, FolderTreeIcon, BoltIcon, ChartBarIcon } from 'lucide-react';

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch(activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'llm':
        return <LLMConfiguration />;
      case 'settings':
        return <SystemSettings />;
      case 'categories':
        return <CategoryHierarchy />;
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
        {renderContent()}
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

const Dashboard = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard title="System Health">
        <div className="flex justify-between">
          <div>CPU Usage: 45%</div>
          <div>Memory: 6.2 GB / 16 GB</div>
        </div>
      </DashboardCard>
      <DashboardCard title="Active Users">
        <div className="text-3xl font-bold">1,245</div>
      </DashboardCard>
      <DashboardCard title="Products Processed (24h)">
        <div className="text-3xl font-bold">12,356</div>
      </DashboardCard>
    </div>
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickActionButton text="Add User" />
        <QuickActionButton text="Generate Report" />
        <QuickActionButton text="Update LLM Config" />
        <QuickActionButton text="View Logs" />
      </div>
    </div>
  </div>
);

const UserManagement = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">User Management</h2>
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <input type="text" placeholder="Search users..." className="p-2 border rounded" />
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
          <tr>
            <td className="p-2">john_doe</td>
            <td className="p-2">john@example.com</td>
            <td className="p-2">Admin</td>
            <td className="p-2">
              <button className="text-blue-500 mr-2">Edit</button>
              <button className="text-red-500">Delete</button>
            </td>
          </tr>
          {/* Add more user rows here */}
        </tbody>
      </table>
    </div>
  </div>
);

const LLMConfiguration = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">LLM Configuration</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-xl font-bold mb-2">Provider List</h3>
        <ul>
          <li className="mb-2">OpenAI</li>
          <li className="mb-2">Anthropic</li>
          <li className="mb-2">Perplexity</li>
        </ul>
        <button className="bg-green-500 text-white px-4 py-2 rounded mt-4">Add Provider</button>
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-xl font-bold mb-2">Model Configurator</h3>
        <form>
          <div className="mb-4">
            <label className="block mb-2">Provider</label>
            <select className="w-full p-2 border rounded">
              <option>OpenAI</option>
              <option>Anthropic</option>
              <option>Perplexity</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Model</label>
            <input type="text" className="w-full p-2 border rounded" placeholder="gpt-3.5-turbo" />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Max Tokens</label>
            <input type="number" className="w-full p-2 border rounded" placeholder="2048" />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save Configuration</button>
        </form>
      </div>
    </div>
  </div>
);

const SystemSettings = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">System Settings</h2>
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-bold mb-4">General Settings</h3>
      <form>
        <div className="mb-4">
          <label className="block mb-2">System Name</label>
          <input type="text" className="w-full p-2 border rounded" placeholder="LLM Product Categorizer" />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Default Language</label>
          <select className="w-full p-2 border rounded">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Timezone</label>
          <select className="w-full p-2 border rounded">
            <option>UTC</option>
            <option>America/New_York</option>
            <option>Europe/London</option>
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save Settings</button>
      </form>
    </div>
  </div>
);

const CategoryHierarchy = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">Category Hierarchy</h2>
    <div className="flex">
      <div className="w-1/3 bg-white rounded-lg shadow p-4 mr-4">
        <h3 className="text-xl font-bold mb-2">Hierarchy Tree</h3>
        <ul className="list-disc list-inside">
          <li>Electronics
            <ul className="list-disc list-inside ml-4">
              <li>Computers
                <ul className="list-disc list-inside ml-4">
                  <li>Laptops</li>
                  <li>Desktops</li>
                </ul>
              </li>
              <li>Smartphones</li>
            </ul>
          </li>
          <li>Clothing
            <ul className="list-disc list-inside ml-4">
              <li>Men's</li>
              <li>Women's</li>
            </ul>
          </li>
        </ul>
      </div>
      <div className="w-2/3 bg-white rounded-lg shadow p-4">
        <h3 className="text-xl font-bold mb-2">Category Editor</h3>
        <form>
          <div className="mb-4">
            <label className="block mb-2">Category Name</label>
            <input type="text" className="w-full p-2 border rounded" placeholder="New Category" />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Parent Category</label>
            <select className="w-full p-2 border rounded">
              <option>None (Top Level)</option>
              <option>Electronics</option>
              <option>Clothing</option>
            </select>
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add Category</button>
        </form>
      </div>
    </div>
  </div>
);

const DashboardCard = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h3 className="text-lg font-bold mb-2">{title}</h3>
    {children}
  </div>
);

const QuickActionButton = ({ text }) => (
  <button className="bg-blue-500 text-white p-2 rounded w-full">{text}</button>
);

export default AdminPanel;
