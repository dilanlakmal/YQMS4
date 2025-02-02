import { FaPlay, FaPause } from 'react-icons/fa';

function PlayPauseButton({ isPlaying, onToggle, timer }) {
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={onToggle}
        className={`flex items-center space-x-2 px-4 py-2 rounded font-medium transition-colors ${
          isPlaying ? 'bg-yellow-400' : 'bg-gray-300'
        }`}
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
        <span>{isPlaying ? 'Pause' : 'Play'}</span>
      </button>
      <div className="text-xl font-mono">
        {timer}
      </div>
    </div>
  );
}

export default PlayPauseButton;
