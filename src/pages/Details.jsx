import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DateSelector from '../components/forms/DateSelector';
import FactorySelect from '../components/forms/FactorySelect';
import LineInput from '../components/forms/LineInput';
import StyleCodeSelect from '../components/forms/StyleCodeSelect';
import StyleDigitInput from '../components/forms/StyleDigitInput';

function Details({ onDetailsSubmit }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date: new Date(),
    factory: '',
    lineNo: '',
    styleCode: '',
    styleDigit: '',
    customer: '',
    moNo: ''
  });

  const updateFormData = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      if (field === 'styleCode' || field === 'styleDigit') {
        newData.moNo = `${newData.styleCode}${newData.styleDigit}`.trim();
      }
      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.factory || !formData.lineNo || !formData.styleCode || !formData.styleDigit) {
      alert('Please fill in all required fields');
      return;
    }
    onDetailsSubmit(formData);
    navigate('/inspection');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Quality Inspection Details</h1>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <DateSelector
            selectedDate={formData.date}
            onChange={(date) => updateFormData('date', date)}
          />
          
          <FactorySelect
            value={formData.factory}
            onChange={(e) => updateFormData('factory', e.target.value)}
          />
          
          <LineInput
            value={formData.lineNo}
            onChange={(value) => updateFormData('lineNo', value)}
          />
          
          <StyleCodeSelect
            value={formData.styleCode}
            onChange={(value) => updateFormData('styleCode', value)}
            onCustomerChange={(customer) => updateFormData('customer', customer)}
          />
          
          <StyleDigitInput
            value={formData.styleDigit}
            onChange={(value) => updateFormData('styleDigit', value)}
          />

          {formData.customer && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Customer</label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md">
                {formData.customer}
              </div>
            </div>
          )}

          {formData.moNo && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">MO No</label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md">
                {formData.moNo}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continue to Inspection
          </button>
        </form>
      </div>
    </div>
  );
}

export default Details;
