
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { OA_LIBRARY } from './constants';
import { MetricType, Factor, ExperimentData, AnalysisResult, OrthogonalArray } from './types';
import { calculateAnalysis } from './services/taguchiEngine';
import { generateTechnicalReport, generateExecutiveReport } from './services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
// Fixed: Added FileText to the lucide-react imports
import { Plus, Trash2, Play, ChevronDown, CheckCircle2, AlertCircle, Info, Sparkles, Download, FileText } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedOA, setSelectedOA] = useState<OrthogonalArray>(OA_LIBRARY[0]);
  const [objective, setObjective] = useState('');
  const [metric, setMetric] = useState<MetricType>(MetricType.SMALLER_BETTER);
  const [factors, setFactors] = useState<Factor[]>([]);
  const [responses, setResponses] = useState<number[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [techReport, setTechReport] = useState('');
  const [execReport, setExecReport] = useState('');
  const [loadingReport, setLoadingReport] = useState(false);

  // Initialize factors when OA changes
  useEffect(() => {
    const newFactors: Factor[] = Array.from({ length: selectedOA.factors }).map((_, i) => ({
      id: `f-${i}`,
      name: `Factor ${String.fromCharCode(65 + i)}`,
      levels: Array.from({ length: selectedOA.levels || 3 }).map((__, j) => `Level ${j + 1}`)
    }));
    setFactors(newFactors);
    setResponses(Array(selectedOA.runs).fill(0));
  }, [selectedOA]);

  const handleAnalyze = () => {
    const data: ExperimentData = {
      oaId: selectedOA.id,
      metricType: metric,
      factors,
      responses,
      objective
    };
    const results = calculateAnalysis(data, selectedOA.matrix);
    setAnalysis(results);
    setStep(4);
  };

  const generateReports = async () => {
    if (!analysis) return;
    setLoadingReport(true);
    try {
      const [tech, exec] = await Promise.all([
        generateTechnicalReport({ oaId: selectedOA.id, metricType: metric, factors, responses, objective }, analysis),
        generateExecutiveReport({ oaId: selectedOA.id, metricType: metric, factors, responses, objective }, analysis)
      ]);
      setTechReport(tech || '');
      setExecReport(exec || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReport(false);
    }
  };

  const getStepClass = (s: number) => 
    `flex items-center gap-2 text-sm font-bold transition-all ${step >= s ? 'text-indigo-600' : 'text-slate-300'}`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      {/* Stepper */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className={getStepClass(1)}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 ${step >= 1 ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200'}`}>1</div>
            <span>Setup Array</span>
          </div>
          <div className="h-[2px] flex-1 mx-4 bg-slate-100">
             <div className="h-full bg-indigo-600 transition-all" style={{ width: step >= 2 ? '100%' : '0%' }}></div>
          </div>
          <div className={getStepClass(2)}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 ${step >= 2 ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200'}`}>2</div>
            <span>Define Factors</span>
          </div>
          <div className="h-[2px] flex-1 mx-4 bg-slate-100">
             <div className="h-full bg-indigo-600 transition-all" style={{ width: step >= 3 ? '100%' : '0%' }}></div>
          </div>
          <div className={getStepClass(3)}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 ${step >= 3 ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200'}`}>3</div>
            <span>Input Results</span>
          </div>
          <div className="h-[2px] flex-1 mx-4 bg-slate-100">
             <div className="h-full bg-indigo-600 transition-all" style={{ width: step >= 4 ? '100%' : '0%' }}></div>
          </div>
          <div className={getStepClass(4)}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 ${step >= 4 ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200'}`}>4</div>
            <span>Optimize</span>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Plus className="text-indigo-600" /> Choose Orthogonal Array
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {OA_LIBRARY.map((oa) => (
                    <button
                      key={oa.id}
                      onClick={() => setSelectedOA(oa)}
                      className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${selectedOA.id === oa.id ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 bg-white'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-slate-800">{oa.name}</span>
                        {selectedOA.id === oa.id && <CheckCircle2 className="text-indigo-600" size={18} />}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed mb-3">{oa.description}</p>
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600">{oa.runs} Runs</span>
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-600">Up to {oa.factors} Factors</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Info className="text-indigo-600" /> Experiment Metadata
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Objective</label>
                    <input 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none bg-slate-50"
                      placeholder="e.g. Optimize plastic injection molding strength"
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Quality Characteristic (Metric)</label>
                    <select 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none bg-slate-50"
                      value={metric}
                      onChange={(e) => setMetric(e.target.value as MetricType)}
                    >
                      {Object.values(MetricType).map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl">
                <h3 className="text-lg font-bold mb-4">Design Summary</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between pb-3 border-b border-indigo-800/50">
                    <span className="text-indigo-200">Array Type</span>
                    <span className="font-mono">{selectedOA.id}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-indigo-800/50">
                    <span className="text-indigo-200">Total Experiments</span>
                    <span className="font-mono">{selectedOA.runs}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-indigo-800/50">
                    <span className="text-indigo-200">Control Factors</span>
                    <span className="font-mono">{selectedOA.factors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-200">DOF Total</span>
                    <span className="font-mono">{selectedOA.runs - 1}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setStep(2)}
                  className="w-full mt-8 bg-white text-indigo-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors shadow-lg"
                >
                  Configure Factors <ChevronDown size={20} className="-rotate-90" />
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-bold">Configure Factor Names & Levels</h2>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Array: {selectedOA.name}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Code</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Factor Name</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Levels</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {factors.map((f, i) => (
                      <tr key={f.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">{String.fromCharCode(65 + i)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <input 
                            className="w-full bg-transparent border-none focus:ring-0 font-medium text-slate-900 p-0"
                            value={f.name}
                            onChange={(e) => {
                              const newFactors = [...factors];
                              newFactors[i].name = e.target.value;
                              setFactors(newFactors);
                            }}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {f.levels.map((lvl, lIdx) => (
                              <input 
                                key={lIdx}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:ring-1 focus:ring-indigo-500 outline-none w-24"
                                value={lvl}
                                onChange={(e) => {
                                  const newFactors = [...factors];
                                  newFactors[i].levels[lIdx] = e.target.value;
                                  setFactors(newFactors);
                                }}
                              />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-white transition-colors">Back</button>
              <button onClick={() => setStep(3)} className="px-6 py-3 rounded-xl bg-indigo-600 font-bold text-white hover:bg-indigo-700 transition-colors shadow-lg">Confirm Setup</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-bold">Orthogonal Matrix & Data Entry</h2>
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold border border-amber-100">
                  <AlertCircle size={14} /> 
                  Standard Run Order
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 font-bold text-slate-500">Exp #</th>
                      {factors.map(f => <th key={f.id} className="px-6 py-4 font-bold text-slate-500">{f.name}</th>)}
                      <th className="px-6 py-4 font-bold text-indigo-600 bg-indigo-50/50 border-l border-indigo-100">Response (Y)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOA.matrix.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono font-bold text-slate-400">#{rIdx + 1}</td>
                        {row.map((lvlIndex, fIdx) => (
                          <td key={fIdx} className="px-6 py-4">
                            <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-medium">
                              {factors[fIdx]?.levels[lvlIndex - 1] || `L${lvlIndex}`}
                            </span>
                          </td>
                        ))}
                        <td className="px-6 py-4 bg-indigo-50/20 border-l border-indigo-100">
                          <input 
                            type="number"
                            className="w-full bg-white px-3 py-2 rounded-lg border border-indigo-100 focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                            value={responses[rIdx] || 0}
                            onChange={(e) => {
                              const newResponses = [...responses];
                              newResponses[rIdx] = parseFloat(e.target.value) || 0;
                              setResponses(newResponses);
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-white transition-colors">Back</button>
              <button onClick={handleAnalyze} className="px-8 py-3 rounded-xl bg-indigo-600 font-bold text-white hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100">
                <Play size={18} fill="currentColor" /> Compute Optimization
              </button>
            </div>
          </div>
        )}

        {step === 4 && analysis && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
            {/* Top Analysis Header */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                 <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-1 tracking-tight">Optimization Results</h2>
                    <p className="text-slate-500 font-medium">Predicted optimal configuration based on Signal-to-Noise ratios</p>
                 </div>
                 <div className="flex gap-2">
                   <button 
                     onClick={generateReports}
                     className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                    >
                     <Sparkles size={18} /> Generate AI Reports
                   </button>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 {analysis.optimalSettings.map((s, idx) => (
                   <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col justify-between">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{s.factor}</span>
                     <span className="text-lg font-bold text-indigo-700">{s.level}</span>
                   </div>
                 ))}
               </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <BarChart size={20} className="text-indigo-600" /> Factor Contribution (ANOVA)
                  </h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analysis.anova} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" unit="%" domain={[0, 100]} hide />
                        <YAxis dataKey="source" type="category" width={100} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <Tooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="contribution" radius={[0, 4, 4, 0]} barSize={24}>
                          {analysis.anova.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#818cf8'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <LineChart size={20} className="text-indigo-600" /> S/N Ratio Trend (Main Effects)
                  </h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={Object.entries(analysis.snByFactor).map(([fIdx, levels]) => ({
                        name: factors[parseInt(fIdx)].name,
                        // Fixed: Cast levels to Record<string, number> to fix "Spread types may only be created from object types" error
                        ...(levels as Record<string, number>)
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '12px' }} />
                        <Line type="monotone" dataKey="1" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="2" stroke="#818cf8" strokeWidth={3} dot={{ r: 4 }} />
                        {selectedOA.levels === 3 && <Line type="monotone" dataKey="3" stroke="#c7d2fe" strokeWidth={3} dot={{ r: 4 }} />}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
               </div>
            </div>

            {/* AI Reports Output */}
            {(techReport || execReport || loadingReport) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <Download className="text-slate-300 hover:text-indigo-600 cursor-pointer" size={20} />
                  </div>
                  <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                    <FileText className="text-indigo-600" size={20} /> Technical Report
                  </h3>
                  {loadingReport ? (
                    <div className="space-y-4">
                       <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                       <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
                       <div className="h-4 bg-slate-100 rounded w-1/2 animate-pulse"></div>
                       <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse"></div>
                    </div>
                  ) : (
                    <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap text-sm">
                      {techReport}
                    </div>
                  )}
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <Download className="text-slate-300 hover:text-indigo-600 cursor-pointer" size={20} />
                  </div>
                  <h3 className="text-xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-600" size={20} /> Executive Summary
                  </h3>
                  {loadingReport ? (
                    <div className="space-y-4">
                       <div className="h-4 bg-slate-100 rounded w-3/4 animate-pulse"></div>
                       <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
                       <div className="h-4 bg-slate-100 rounded w-1/2 animate-pulse"></div>
                    </div>
                  ) : (
                    <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap text-sm">
                      {execReport}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex justify-center pb-12">
               <button onClick={() => setStep(1)} className="px-8 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-white transition-colors">Start New Experiment</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
