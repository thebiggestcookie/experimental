import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Download, RefreshCw } from 'lucide-react';

// Simulated data
const performanceData = [
  { date: '2023-08-01', humanAccuracy: 92, aiAccuracy: 88, productsProcessed: 1000 },
  { date: '2023-08-02', humanAccuracy: 94, aiAccuracy: 89, productsProcessed: 1050 },
  { date: '2023-08-03', humanAccuracy: 93, aiAccuracy: 90, productsProcessed: 980 },
  { date: '2023-08-04', humanAccuracy: 95, aiAccuracy: 91, productsProcessed: 1100 },
  { date: '2023-08-05', humanAccuracy: 91, aiAccuracy: 88, productsProcessed: 950 },
  { date: '2023-08-06', humanAccuracy: 96, aiAccuracy: 92, productsProcessed: 1150 },
  { date: '2023-08-07', humanAccuracy: 94, aiAccuracy: 90, productsProcessed: 1080 },
];

const humanGraders = [
  { name: 'Alice', accuracy: 96, speed: 135, productsProcessed: 1200 },
  { name: 'Bob', accuracy: 94, speed: 128, productsProcessed: 1100 },
  { name: 'Charlie', accuracy: 92, speed: 120, productsProcessed: 1000 },
  { name: 'Diana', accuracy: 95, speed: 130, productsProcessed: 1150 },
  { name: 'Evan', accuracy: 93, speed: 125, productsProcessed: 1050 },
];

const productCategories = [
  { name: 'Electronics', accuracy: 92, coverage: 95, productsProcessed: 3000 },
  { name: 'Clothing', accuracy: 90, coverage: 93, productsProcessed: 2500 },
  { name: 'Home & Garden', accuracy: 88, coverage: 91, productsProcessed: 2000 },
  { name: 'Books', accuracy: 94, coverage: 97, productsProcessed: 1500 },
  { name: 'Toys', accuracy: 91, coverage: 94, productsProcessed: 1000 },
];

const ReportingAnalyticsDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Reporting and Analytics Dashboard</h1>

      {/* Date Range and Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <span className="font-medium">Date Range: Last 7 Days</span>
          <button className="flex items-center px-3 py-1 bg-gray-200 rounded">
            <Calendar size={18} className="mr-2" />
            Change Date
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center px-3 py-1 bg-green-500 text-white rounded">
            <Download size={18} className="mr-2" />
            Export
          </button>
          <button className="flex items-center px-3 py-1 bg-blue-500 text-white rounded">
            <RefreshCw size={18} className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { title: 'Human Accuracy', value: '94%', change: '+2%' },
          { title: 'AI Accuracy', value: '90%', change: '+3%' },
          { title: 'Products Processed', value: '7,310', change: '+5%' },
        ].map((metric, index) => (
          <div key={index} className="bg-white p-3 rounded-lg shadow text-center">
            <h3 className="text-sm font-semibold mb-1">{metric.title}</h3>
            <p className="text-lg font-bold mb-1">{metric.value}</p>
            <p className={`text-xs ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {metric.change}
            </p>
          </div>
        ))}
      </div>

      {/* Performance Over Time Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Performance Over Time</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="humanAccuracy" stroke="#8884d8" name="Human Accuracy" />
            <Line type="monotone" dataKey="aiAccuracy" stroke="#82ca9d" name="AI Accuracy" />
            <Line type="monotone" dataKey="productsProcessed" stroke="#ffc658" name="Products Processed" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Human Graders Table */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">Top Human Graders</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Accuracy</th>
                <th className="px-4 py-2 text-left">Speed (products/hour)</th>
                <th className="px-4 py-2 text-left">Products Processed</th>
              </tr>
            </thead>
            <tbody>
              {humanGraders.map((grader) => (
                <tr key={grader.name}>
                  <td className="px-4 py-2">{grader.name}</td>
                  <td className="px-4 py-2">{grader.accuracy}%</td>
                  <td className="px-4 py-2">{grader.speed}</td>
                  <td className="px-4 py-2">{grader.productsProcessed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Categories Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Product Categories Performance</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={productCategories}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="accuracy" fill="#8884d8" name="Accuracy" />
            <Bar dataKey="coverage" fill="#82ca9d" name="Coverage" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReportingAnalyticsDashboard;
