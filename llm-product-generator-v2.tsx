import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, AlertCircle, Save, Upload, Bug, RefreshCw } from 'lucide-react';

// Simulated API calls
const generateProductList = async (input) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return ['Product A', 'Product B', 'Product C'];
};

const identifySubcategory = async (product) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return 'Electronics > Smartphones';
};

const mapAttributes = async (product, subcategory) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    { name: 'Brand', value: 'TechCo' },
    { name: 'Model', value: 'X1' },
    { name: 'Color', value: 'Black' },
    { name: 'Storage', value: '128GB' },
  ];
};

const ProductGenerator = () => {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const [generatedProducts, setGeneratedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [subcategory, setSubcategory] = useState('');
  const [attributes, setAttributes] = useState([]);
  const [debugView, setDebugView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [llmProvider, setLlmProvider] = useState('openai');
  const [bulkUpload, setBulkUpload] = useState(false);

  const steps = [
    { title: 'Generate Product List', description: 'Enter a product name or type to generate a list of products.' },
    { title: 'Identify Subcategory', description: 'The system will identify the appropriate subcategory for the selected product.' },
    { title: 'Map Attributes', description: 'The system will map relevant attributes to the product based on its subcategory.' },
  ];

  const handleGenerateList = async () => {
    setLoading(true);
    setError(null);
    try {
      const products = await generateProductList(input);
      setGeneratedProducts(products);
      setStep(1);
    } catch (err) {
      setError('Failed to generate product list. Please try again.');
    }
    setLoading(false);
  };

  const handleSelectProduct = async (product) => {
    setSelectedProduct(product);
    setLoading(true);
    setError(null);
    try {
      const category = await identifySubcategory(product);
      setSubcategory(category);
      setStep(2);
    } catch (err) {
      setError('Failed to identify subcategory. Please try again.');
    }
    setLoading(false);
  };

  const handleMapAttributes = async () => {
    setLoading(true);
    setError(null);
    try {
      const mappedAttributes = await mapAttributes(selectedProduct, subcategory);
      setAttributes(mappedAttributes);
      setStep(3);
    } catch (err) {
      setError('Failed to map attributes. Please try again.');
    }
    setLoading(false);
  };

  const handleSave = () => {
    // In a real application, this would send the data to your backend
    console.log('Saving product:', { product: selectedProduct, subcategory, attributes });
    alert('Product saved successfully!');
  };

  const renderDebugInfo = () => (
    <div className="bg-gray-100 p-4 rounded-lg mt-4">
      <h4 className="font-semibold mb-2">Debug Information:</h4>
      <pre className="whitespace-pre-wrap text-sm">
        {JSON.stringify(
          {
            step,
            input,
            generatedProducts,
            selectedProduct,
            subcategory,
            attributes,
            llmProvider,
          },
          null,
          2
        )}
      </pre>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Product Generator</h1>

      {/* LLM Provider Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">LLM Provider:</label>
        <select
          value={llmProvider}
          onChange={(e) => setLlmProvider(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic</option>
          <option value="perplexity">Perplexity</option>
        </select>
      </div>

      {/* Bulk Upload Toggle */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={bulkUpload}
            onChange={() => setBulkUpload(!bulkUpload)}
            className="form-checkbox h-5 w-5 text-indigo-600"
          />
          <span className="ml-2 text-gray-700">Bulk Upload Mode</span>
        </label>
      </div>

      {/* Steps */}
      <div className="mb-8">
        {steps.map((s, index) => (
          <div key={index} className={`flex items-center mb-4 ${index <= step ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${index < step ? 'bg-indigo-600 text-white' : 'border-2 border-current'}`}>
              {index < step ? <Check size={20} /> : index + 1}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium">{s.title}</p>
              <p className="text-xs">{s.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        {step === 0 && (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {bulkUpload ? 'Enter product names (one per line):' : 'Enter product name or type:'}
            </label>
            {bulkUpload ? (
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                rows={5}
                placeholder="Product 1&#10;Product 2&#10;Product 3"
              />
            ) : (
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                placeholder="e.g., Smartphone"
              />
            )}
            <button
              onClick={handleGenerateList}
              disabled={!input.trim() || loading}
              className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Product List'}
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <h3 className="text-lg font-medium mb-4">Select a Product:</h3>
            <ul className="space-y-2">
              {generatedProducts.map((product, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleSelectProduct(product)}
                    className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {product}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="text-lg font-medium mb-4">Identified Subcategory:</h3>
            <p className="mb-4">{subcategory}</p>
            <button
              onClick={handleMapAttributes}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Map Attributes
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h3 className="text-lg font-medium mb-4">Mapped Attributes:</h3>
            <ul className="space-y-2 mb-4">
              {attributes.map((attr, index) => (
                <li key={index} className="flex justify-between">
                  <span className="font-medium">{attr.name}:</span>
                  <span>{attr.value}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={handleSave}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Save size={18} className="inline mr-2" />
              Save Product
            </button>
          </>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Debug Toggle */}
      <button
        onClick={() => setDebugView(!debugView)}
        className="flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        <Bug size={18} className="mr-2" />
        {debugView ? 'Hide' : 'Show'} Debug Info
      </button>

      {/* Debug Information */}
      {debugView && renderDebugInfo()}
    </div>
  );
};

export default ProductGenerator;
