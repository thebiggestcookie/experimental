import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Download, RefreshCw } from 'lucide-react';

const ReportingAnalyticsDashboard = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [humanGraders, setHumanGraders] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [dateRange, setDateRange] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const performanceResponse = await fetch(`/api/performance-metrics?range=${dateRange}`);
      const performanceData = await performanceResponse.json();
      setPerformanceData(performanceData);

      const gradersResponse = await fetch('/api/human-graders');
      const gradersData = await gradersResponse.json();
      setHumanGraders(gradersData);

      const categoriesResponse = await fetch('/api/product-categories');
      const categoriesData = await categoriesResponse.json();
      setProductCategories(categoriesData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting data...');
  };

  const handleRefresh = () => {
    fetchData();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Reporting and Analytics Dashboard</h1>

      {/* Date Range and Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <span className="font-medium">Date Range:</span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={handleExport} className="flex items-center px-3 py-1 bg-green-500 text-white rounded">
            <Download size={18} className="mr-2" />
            Export
          </button>
          <button onClick={handleRefresh} className="flex items-center px-3 py-1 bg-blue-500 text-white rounded">
            <RefreshCw size={18} className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { title: 'Human Accuracy', value: `${performanceData.humanAccuracy}%`, change: `${performanceData.humanAccuracyChange}%` },
          { title: 'AI Accuracy', value: `${performanceData.aiAccuracy}%`, change: `${performanceData.aiAccuracyChange}%` },
          { title: 'Products Processed', value: performanceData.productsProcessed, change: `${performanceData.productsProcessedChange}%` },
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
          <LineChart data={performanceData.timeSeriesData}>
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
                <tr key={grader.id}>
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
