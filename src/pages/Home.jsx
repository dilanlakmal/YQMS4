import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">QA/QC Inspection Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            onClick={() => navigate('/details')}
            className="bg-white p-8 rounded-lg shadow-md cursor-pointer transform transition-transform hover:scale-105"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quality Data Inspection</h2>
            <p className="text-gray-600">Click to start a new inspection</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
