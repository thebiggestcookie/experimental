import React, { useState, useEffect } from 'react';
import { Check, X, AlertTriangle, ChevronRight, ChevronLeft, RotateCcw, Edit2 } from 'lucide-react';

// Simulated API calls
const fetchNextProduct = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    id: Math.floor(Math.random() * 1000000),
    title: "TechCo Smartphone X1 - 128GB, Black",
    name: "Smartphone X1",
    category: "Electronics",
    subcategory: "Smartphones",
    imageUrl: "/api/placeholder/300/300",  // Placeholder image
    attributes: [
      { 
        name: "Brand", 
        value: "TechCo", 
        aiConfidence: 0.95,
        options: ["TechCo", "AppleCo", "SamsungCo", "Other"]
      },
      { 
        name: "Model", 
        value: "X1", 
        aiConfidence: 0.98,
        options: ["X1", "X2", "Y1", "Z1"]
      },
      { 
        name: "Color", 
        value: "Black", 
        aiConfidence: 0.92,
        options: ["Black", "White", "Silver", "Gold", "Other"]
      },
      { 
        name: "Storage", 
        value: "128GB", 
        aiConfidence: 0.89,
        options: ["64GB", "128GB", "256GB", "512GB"]
      },
      { 
        name: "Camera", 
        value: "Dual 12MP", 
        aiConfidence: 0.85,
        options: ["Single 12MP", "Dual 12MP", "Triple 12MP", "Other"]
      },
    ]
  };
};

const submitGradedProduct = async (product) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  console.log("Product submitted:", product);
  return { success: true };
};

const HumanGraderInterface = () => {
  const [currentProduct, setCurrentProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ reviewed: 0, accuracy: 100, startTime: Date.now() });

  const fetchProduct = async () => {
    setLoading(true);
    const product = await fetchNextProduct();
    setCurrentProduct(product);
    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleAttributeChange = (index, newValue) => {
    const updatedProduct = { ...currentProduct };
    updatedProduct.attributes[index].value = newValue;
    updatedProduct.attributes[index].humanEdited = true;
    setCurrentProduct(updatedProduct);
  };

  const handleSubmit = async (approved) => {
    if (currentProduct) {
      await submitGradedProduct({ ...currentProduct, humanApproved: approved });
      setStats(prev => ({
        reviewed: prev.reviewed + 1,
        accuracy: approved ? prev.accuracy : (prev.accuracy * prev.reviewed + 0) / (prev.reviewed + 1),
        startTime: prev.startTime
      }));
      fetchProduct();
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Human Grader Interface</h1>

      {/* Performance Stats */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6 flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">Products Reviewed: {stats.reviewed}</p>
          <p className="text-sm font-medium">Accuracy: {stats.accuracy.toFixed(2)}%</p>
        </div>
        <div>
          <p className="text-sm font-medium">
            Speed: {(stats.reviewed / ((Date.now() - stats.startTime) / 3600000)).toFixed(2)} products/hour
          </p>
        </div>
      </div>

      {currentProduct && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">{currentProduct.title}</h2>
          <div className="flex mb-6">
            <div className="w-1/3 pr-4">
              <img src={currentProduct.imageUrl} alt={currentProduct.name} className="w-full h-auto rounded-lg" />
            </div>
            <div className="w-2/3">
              <p className="text-gray-600 mb-4">
                Category: {currentProduct.category} &gt; {currentProduct.subcategory}
              </p>
              <div>
                <h3 className="text-lg font-medium mb-2">Attributes:</h3>
                {currentProduct.attributes.map((attr, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <span className="w-1/4 font-medium">{attr.name}:</span>
                    <div className="w-1/2">
                      <select
                        value={attr.value}
                        onChange={(e) => handleAttributeChange(index, e.target.value)}
                        className="w-full px-2 py-1 border rounded"
                      >
                        {attr.options.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-1/4 flex items-center justify-end">
                      <span className={`text-sm ${attr.aiConfidence > 0.9 ? 'text-green-500' : attr.aiConfidence > 0.7 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {(attr.aiConfidence * 100).toFixed(0)}% confident
                      </span>
                      {attr.humanEdited && <AlertTriangle size={16} className="ml-2 text-blue-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center space-x-4">
            <button
              onClick={() => handleSubmit(false)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <X size={18} className="inline mr-2" />
              Reject
            </button>
            <button
              onClick={() => handleSubmit(true)}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Check size={18} className="inline mr-2" />
              Approve
            </button>
          </div>
        </div>
      )}

      {/* Navigation and Controls */}
      <div className="flex justify-between items-center">
        <button
          onClick={fetchProduct}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ChevronLeft size={18} className="inline mr-2" />
          Previous Product
        </button>
        <button
          onClick={fetchProduct}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <RotateCcw size={18} className="inline mr-2" />
          Skip Product
        </button>
        <button
          onClick={fetchProduct}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Next Product
          <ChevronRight size={18} className="inline ml-2" />
        </button>
      </div>
    </div>
  );
};

export default HumanGraderInterface;
