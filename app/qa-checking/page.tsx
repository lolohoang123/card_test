'use client';

import { useState } from 'react';

interface QAItem {
  id: number;
  title: string;
  endpoint: string;
}

export default function QAChecking() {
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
  const [items] = useState<QAItem[]>([
    { id: 1, title: 'Check the GIT', endpoint: 'http://127.0.0.1:8000/git' },
    { id: 2, title: 'Check the SVN', endpoint: 'http://127.0.0.1:8000/svn' },
  ]);

  const handleCheck = async (item: QAItem) => {
    setLoading(prev => ({ ...prev, [item.id]: true }));
    try {
      const response = await fetch(item.endpoint);
      let filename = '';
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
      const day = String(today.getDate()).padStart(2, '0');
      const currentDate = `${year}${month}${day}`;
      if (item.id == 1) {
        filename =  'git_result_' +currentDate+'.xlsx'
        
      }else{
        filename =  'svn_result_' +currentDate+'.xlsx'
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(prev => ({ ...prev, [item.id]: false }));
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">QA Checking</h1>
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">No</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Title</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">Check</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium border-b border-gray-200">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200">{item.title}</td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  <button
                    onClick={() => handleCheck(item)}
                    disabled={loading[item.id]}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      loading[item.id]
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 hover:shadow-md active:bg-blue-700'
                    } text-white`}
                  >
                    {loading[item.id] ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Checking...
                      </span>
                    ) : 'Check'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 