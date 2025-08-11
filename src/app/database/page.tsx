'use client';

import { useState, useEffect } from 'react';

interface TableCounts {
  users: number;
  listings: number;
  packages: number;
  leads: number;
  messages: number;
  conversations: number;
  favorites: number;
}

interface DatabaseData {
  tables?: TableCounts;
  data?: any[];
  count?: number;
  error?: string;
}

export default function DatabaseViewer() {
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [data, setData] = useState<DatabaseData>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTableCounts();
  }, []);

  const fetchTableCounts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/database');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching table counts:', error);
      setData({ error: 'Failed to fetch table counts' });
    } finally {
      setLoading(false);
    }
  };

  const fetchTableData = async (table: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/database?table=${table}`);
      const result = await response.json();
      setData(result);
      setSelectedTable(table);
    } catch (error) {
      console.error('Error fetching table data:', error);
      setData({ error: 'Failed to fetch table data' });
    } finally {
      setLoading(false);
    }
  };

  const renderTableData = () => {
    if (!data.data || data.data.length === 0) {
      return <p className="text-gray-500">No data found</p>;
    }

    const firstItem = data.data[0];
    const columns = Object.keys(firstItem);

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              {columns.map((column) => (
                <th key={column} className="border border-gray-300 px-4 py-2 text-left font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.data.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {columns.map((column) => (
                  <td key={column} className="border border-gray-300 px-4 py-2">
                    {typeof row[column] === 'object' && row[column] !== null
                      ? JSON.stringify(row[column], null, 2)
                      : String(row[column] || '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Database Viewer</h1>
      
      {loading && (
        <div className="text-center py-4">
          <p>Loading...</p>
        </div>
      )}

      {data.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {data.error}
        </div>
      )}

      {data.tables && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Database Tables</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(data.tables).map(([table, count]) => (
              <button
                key={table}
                onClick={() => fetchTableData(table)}
                className={`p-4 border rounded-lg hover:bg-blue-50 transition-colors ${
                  selectedTable === table ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-300'
                }`}
              >
                <div className="font-semibold capitalize">{table}</div>
                <div className="text-sm text-gray-600">{count} records</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedTable && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold capitalize">{selectedTable} Data</h2>
            <button
              onClick={fetchTableCounts}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Back to Overview
            </button>
          </div>
          
          {data.count !== undefined && (
            <p className="mb-4 text-gray-600">Showing {data.count} records</p>
          )}
          
          {renderTableData()}
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Database Info</h3>
        <p className="text-sm text-gray-600">
          Database: SQLite (./db/custom.db)<br/>
          ORM: Prisma<br/>
          Server: http://localhost:5544
        </p>
      </div>
    </div>
  );
}
