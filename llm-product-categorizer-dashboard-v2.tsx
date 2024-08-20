import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, ChevronDown, AlertCircle, Award, Zap, DollarSign, FileText, Users } from 'lucide-react';

const Dashboard = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [modelComparisonData, setModelComparisonData] = useState([]);
  const [topHumanGraders, setTopHumanGraders] = useState([]);
  const [dateRange, setDateRange] = useState('week');
  const [selectedModels, setSelectedModels] = useState(['GPT-4', 'Claude 2']);
  const [debugMode, setDebugMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [performanceResponse, modelComparisonResponse, gradersResponse] = await Promise.all([
        fetch(`/api/performance-metrics?range=${dateRange}`),
        fetch('/api/model-comparison'),
        fetch('/api/top-human-graders')
      ]);

      const performanceData = await performanceResponse.json();
      const modelComparisonData = await modelComparisonResponse.json();
      const gradersData = await gradersResponse.json();

      setPerformanceData(performanceData);
      setModelComparisonData(modelComparisonData);
      setTopHumanGraders(gradersData);

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
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm leading-5"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Export Data
          </button>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Refresh
          </button>
          <button
            onClick={() => setDebugMode(!debugMode)}
            className={`px-4 py-2 rounded-md ${debugMode ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {debugMode ? 'Disable Debug' : 'Enable Debug'}
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          { title: 'Products Processed', value: performanceData.productsProcessed, icon: <FileText size={24} />, change: performanceData.productsProcessedChange },
          { title: 'Human Accuracy', value: `${performanceData.humanAccuracy}%`, icon: <Users size={24} />, change: performanceData.humanAccuracyChange },
          { title: 'AI Accuracy', value: `${performanceData.aiAccuracy}%`, icon: <Zap size={24} />, change: performanceData.aiAccuracyChange },
          { title: 'Token Usage', value: performanceData.tokenUsage, icon: <DollarSign size={24} />, change: performanceData.tokenUsageChange },
        ].map((metric) => (
          <div key={metric.title} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">{metric.title}</h3>
              {metric.icon}
            </div>
            <p className="text-3xl font-bold mb-2">{metric.value}</p>
            <p className={`text-sm ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metric.change >= 0 ? `+${metric.change}%` : `${metric.change}%`} vs. previous period
            </p>
          </div>
        ))}
      </div>

      {/* Performance Over Time Chart */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Performance Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData.timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="humanAccuracy" stroke="#8884d8" name="Human Accuracy" />
            <Line yAxisId="left" type="monotone" dataKey="aiAccuracy" stroke="#82ca9d" name="AI Accuracy" />
            <Line yAxisId="right" type="monotone" dataKey="productsProcessed" stroke="#ffc658" name="Products Processed" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Model Comparison */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Model Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={modelComparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="model" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="accuracy" fill="#8884d8" name="Accuracy" />
            <Bar dataKey="speed" fill="#82ca9d" name="Speed" />
            <Bar dataKey="tokenUsage" fill="#ffc658" name="Token Usage" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Human Graders */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Top Human Graders</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speed (products/hour)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Award</th>
              </tr>
            </thead>
            <tbody>
              {topHumanGraders.map((grader, index) => (
                <tr key={grader.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{grader.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grader.accuracy}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grader.speed}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index === 0 && <Award className="text-yellow-400" size={20} />}
                    {index === 1 && <Award className="text-gray-400" size={20} />}
                    {index === 2 && <Award className="text-yellow-600" size={20} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Debug Information */}
      {debugMode && (
        <div className="bg-gray-100 p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Debug Information</h3>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify({ dateRange, selectedModels, performanceData: performanceData.timeSeriesData[performanceData.timeSeriesData.length - 1] }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
