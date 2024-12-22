import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/inspection/Header';
import ViewToggle from '../components/inspection/ViewToggle';
import DefectsList from '../components/inspection/DefectsList';
import Summary from '../components/inspection/Summary';
import PlayPauseButton from '../components/inspection/PlayPauseButton';
import PreviewModal from '../components/inspection/PreviewModal';
import { defectsList } from '../constants/defects';

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function Inspection({ savedState, onStateChange, onLogEntry, onStartTime }) {
  const navigate = useNavigate();

  const [view, setView] = useState(savedState?.view || 'list');
  const [language, setLanguage] = useState(savedState?.language || 'english');
  const [defects, setDefects] = useState(savedState?.defects || {});
  const [currentDefectCount, setCurrentDefectCount] = useState(savedState?.currentDefectCount || {});
  const [checkedQuantity, setCheckedQuantity] = useState(savedState?.checkedQuantity || 0);
  const [goodOutput, setGoodOutput] = useState(savedState?.goodOutput || 0);
  const [defectPieces, setDefectPieces] = useState(savedState?.defectPieces || 0);
  const [showPreview, setShowPreview] = useState(false);
  const [inspectionData, setInspectionData] = useState(savedState?.inspectionData || null);
  const [isPlaying, setIsPlaying] = useState(savedState?.isPlaying || false);
  const [timer, setTimer] = useState(savedState?.timer || 0);
  const [startTime, setStartTime] = useState(savedState?.startTime || null);
  const [hasDefectSelected, setHasDefectSelected] = useState(savedState?.hasDefectSelected || false);

  useEffect(() => {
    if (!savedState?.inspectionData && !inspectionData) {
      navigate('/details');
    } else if (savedState?.inspectionData) {
      setInspectionData(savedState.inspectionData);
    }
  }, [savedState, inspectionData, navigate]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (inspectionData) {
      onStateChange({
        defects,
        currentDefectCount,
        checkedQuantity,
        goodOutput,
        defectPieces,
        language,
        view,
        inspectionData,
        isPlaying,
        timer,
        startTime,
        hasDefectSelected
      });
    }
  }, [
    defects, currentDefectCount, checkedQuantity, goodOutput,
    defectPieces, language, view, inspectionData, isPlaying,
    timer, startTime, hasDefectSelected, onStateChange
  ]);

  const handlePlayPause = () => {
    if (!isPlaying) {
      const time = new Date();
      setStartTime(time);
      onStartTime?.(time);
    }
    setIsPlaying(!isPlaying);
  };

  const handlePass = () => {
    if (!isPlaying || hasDefectSelected) return;
    
    setCheckedQuantity(prev => prev + 1);
    setGoodOutput(prev => prev + 1);
    
    onLogEntry?.({
      type: 'pass',
      garmentNo: checkedQuantity + 1,
      timestamp: new Date().getTime()
    });
  };

  const handleReject = () => {
    if (!isPlaying) return;
    
    setCheckedQuantity(prev => prev + 1);
    setDefectPieces(prev => prev + 1);
    
    const currentTime = new Date().getTime();
    const currentDefects = Object.entries(currentDefectCount)
      .filter(([_, count]) => count > 0)
      .map(([index, count]) => ({
        name: defectsList[language][index],
        count,
        timestamp: currentTime
      }));

    onLogEntry?.({
      type: 'reject',
      garmentNo: checkedQuantity + 1,
      defectDetails: currentDefects,
      timestamp: currentTime
    });

    // Reset current defect counts and enable Pass button
    setCurrentDefectCount({});
    setHasDefectSelected(false);
  };

  const handleDefectUpdate = (index, value) => {
    setDefects(prev => ({ ...prev, [index]: value }));
    setHasDefectSelected(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="fixed top-16 left-0 right-0 bg-white shadow-md z-40">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <Header inspectionData={inspectionData} />
        </div>
      </div>

      <div className="fixed top-32 left-0 right-0 bg-white shadow-md z-30">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <ViewToggle
              view={view}
              onViewChange={setView}
              onLanguageChange={setLanguage}
            />
            <PlayPauseButton
              isPlaying={isPlaying}
              onToggle={handlePlayPause}
              timer={formatTime(timer)}
            />
          </div>
          <button
            onClick={() => setShowPreview(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Preview
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-40 pb-32">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-2">
            <button
              onClick={handlePass}
              disabled={!isPlaying || hasDefectSelected}
              className={`w-full py-2 rounded font-medium ${
                isPlaying && !hasDefectSelected ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}
            >
              Pass
            </button>
          </div>
          <div className="col-span-8">
            <DefectsList
              view={view}
              language={language}
              defects={defects}
              currentDefectCount={currentDefectCount}
              onDefectUpdate={handleDefectUpdate}
              onCurrentDefectUpdate={(index, value) => {
                setCurrentDefectCount(prev => ({ ...prev, [index]: value }));
                setHasDefectSelected(true);
              }}
              onLogEntry={onLogEntry}
              isPlaying={isPlaying}
            />
          </div>
          <div className="col-span-2">
            <button
              onClick={handleReject}
              disabled={!isPlaying}
              className={`w-full py-2 rounded font-medium ${
                isPlaying ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}
            >
              Reject
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Summary
            defects={defects}
            checkedQuantity={checkedQuantity}
            goodOutput={goodOutput}
            defectPieces={defectPieces}
          />
        </div>
      </div>

      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        inspectionData={inspectionData}
        defects={defects}
        checkedQuantity={checkedQuantity}
        goodOutput={goodOutput}
        defectPieces={defectPieces}
        language={language}
      />
    </div>
  );
}

export default Inspection;
