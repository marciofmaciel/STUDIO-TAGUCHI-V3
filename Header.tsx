
import React from 'react';
import { Beaker, Settings, FileText, ChevronRight } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Beaker size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Studio Taguchi <span className="text-indigo-600">V3</span></h1>
            <p className="text-xs text-slate-500 font-medium">Professional DOE Optimizer</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-semibold text-indigo-600 border-b-2 border-indigo-600 pb-5 mt-5">Design Studio</a>
          <a href="#" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Documentation</a>
          <a href="#" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">Library</a>
        </nav>

        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-slate-600">
            <Settings size={20} />
          </button>
          <button className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold hover:bg-indigo-100 transition-all border border-indigo-100">
            <FileText size={16} />
            <span>Project Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
