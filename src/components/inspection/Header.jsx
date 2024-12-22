import React from 'react';

function Header({ inspectionData }) {
  if (!inspectionData) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg shadow mb-4">
        <p className="text-yellow-700">No inspection data available. Please start from the Details page.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex space-x-4 text-sm">
        <div>Date: {inspectionData.date?.toLocaleDateString() || 'N/A'}</div>
        <div>Factory: {inspectionData.factory || 'N/A'}</div>
        <div>Line: {inspectionData.lineNo || 'N/A'}</div>
        <div>Style: {`${inspectionData.styleCode || ''}${inspectionData.styleDigit || ''}`}</div>
        <div>Customer: {inspectionData.customer || 'N/A'}</div>
      </div>
    </div>
  );
}

export default Header;
