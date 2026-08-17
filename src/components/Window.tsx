import React from 'react';
import { Rnd } from 'react-rnd';
import { Minus, Square, X } from 'lucide-react';
import { useOSStore, WindowState } from '../store/useOSStore';
import { SettingsApp } from '../apps/SettingsApp';
import { BrowserApp } from '../apps/BrowserApp';

interface WindowProps {
  windowState: WindowState;
}

export const Window: React.FC<WindowProps> = ({ windowState }) => {
  const { closeWindow, minimizeWindow, focusWindow } = useOSStore();

  if (windowState.isMinimized) return null;

  const renderAppContent = () => {
    switch (windowState.appId) {
      case 'settings':
        return <SettingsApp />;
      case 'browser':
        return <BrowserApp />;
      default:
        return <div className="p-4 text-white">Application content here</div>;
    }
  };

  return (
    <Rnd
      default={{
        x: 100,
        y: 60,
        width: 800,
        height: 500,
      }}
      minWidth={400}
      minHeight={300}
      bounds="parent"
      style={{ zIndex: windowState.zIndex }}
      onMouseDown={() => focusWindow(windowState.id)}
      className="flex flex-col rounded-lg overflow-hidden shadow-2xl bg-slate-900 border border-slate-700/50 backdrop-blur-md"
    >
      {/* ChromeOS Window Header */}
      <div className="h-9 bg-slate-800/80 select-none flex items-center justify-between px-3 border-b border-slate-700/50">
        <span className="text-xs font-medium text-slate-200">{windowState.title}</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => minimizeWindow(windowState.id)}
            className="p-1 hover:bg-slate-700 rounded text-slate-300"
          >
            <Minus size={14} />
          </button>
          <button className="p-1 hover:bg-slate-700 rounded text-slate-300">
            <Square size={12} />
          </button>
          <button
            onClick={() => closeWindow(windowState.id)}
            className="p-1 hover:bg-red-500 hover:text-white rounded text-slate-300 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* App Body */}
      <div className="flex-1 overflow-auto bg-slate-950 text-slate-100">
        {renderAppContent()}
      </div>
    </Rnd>
  );
};
