import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import Details from './pages/Details';
import Inspection from './pages/Inspection';
import Profile from './pages/Profile';
import Logs from './pages/Logs';
import Navbar from './components/layout/Navbar';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inspectionState, setInspectionState] = useState(null);
  const [logsState, setLogsState] = useState({
    details: null,
    logs: [],
    startTime: null
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setInspectionState(null);
    setLogsState({
      details: null,
      logs: [],
      startTime: null
    });
  };

  const handleDetailsSubmit = (details) => {
    const initialState = {
      inspectionData: details,
      defects: {},
      currentDefectCount: {},
      checkedQuantity: 0,
      goodOutput: 0,
      defectPieces: 0,
      language: 'english',
      view: 'list',
      isPlaying: false,
      timer: 0,
      startTime: null,
      hasDefectSelected: false,
      inspectionLogs: []
    };

    setInspectionState(initialState);
    setLogsState(prev => ({
      ...prev,
      details
    }));
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to="/details" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          } 
        />
        {isAuthenticated ? (
          <Route
            path="/*"
            element={
              <>
                <Navbar onLogout={handleLogout} />
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route 
                    path="/details" 
                    element={
                      <Details 
                        onDetailsSubmit={handleDetailsSubmit}
                      />
                    } 
                  />
                  <Route 
                    path="/inspection" 
                    element={
                      inspectionState ? (
                        <Inspection 
                          savedState={inspectionState} 
                          onStateChange={setInspectionState}
                          onLogEntry={(entry) => setLogsState(prev => ({
                            ...prev,
                            logs: [...prev.logs, entry]
                          }))}
                          onStartTime={(time) => setLogsState(prev => ({
                            ...prev,
                            startTime: time
                          }))}
                        />
                      ) : (
                        <Navigate to="/details" replace />
                      )
                    } 
                  />
                  <Route 
                    path="/logs" 
                    element={
                      <Logs 
                        logsState={logsState}
                      />
                    } 
                  />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </>
            }
          />
        ) : (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
