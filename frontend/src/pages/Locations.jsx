import React, { useState, useEffect } from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import { locationAPI } from '../services/api';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const provinces = ['Kigali', 'Eastern', 'Western', 'Northern', 'Southern'];

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await locationAPI.getAllLocations();
      // Handle both array response and object with data property
      const locationsData = Array.isArray(response.data) 
        ? response.data 
        : Array.isArray(response) 
        ? response 
        : [];
      
      setLocations(locationsData);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Locations Management</h1>
        <p className="text-gray-600 mt-2">Manage Rwandan administrative locations</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {provinces.map((province) => (
            <div
              key={province}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{province} Province</h3>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                View districts, sectors, cells, and villages
              </p>
              <button className="w-full px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium">
                Explore Hierarchy
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Location Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90 mb-1">Provinces</p>
          <p className="text-3xl font-bold">5</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90 mb-1">Districts</p>
          <p className="text-3xl font-bold">30</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90 mb-1">Sectors</p>
          <p className="text-3xl font-bold">416</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90 mb-1">Cells</p>
          <p className="text-3xl font-bold">2,148</p>
        </div>
      </div>
    </div>
  );
};

export default Locations;