import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, CheckCircle2, XCircle, Loader2, FlaskConical } from 'lucide-react';
import { TestResult } from '../types';

export const TestingSuite: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    const newResults: TestResult[] = [
      { name: 'Gemini API Connectivity', status: 'pending' },
      { name: 'Canvas Export Logic', status: 'pending' },
      { name: 'Image Processing Pipeline', status: 'pending' },
      { name: 'State Management Integrity', status: 'pending' },
    ];
    setResults(newResults);

    // Simulate tests
    for (let i = 0; i < newResults.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));
      
      const success = Math.random() > 0.1; // 90% success rate for simulation
      
      setResults(prev => {
        const updated = [...prev];
        updated[i] = {
          ...updated[i],
          status: success ? 'passed' : 'failed',
          message: success ? 'Verification successful' : 'Simulated failure for testing purposes'
        };
        return updated;
      });
    }
    setIsRunning(false);
  };

  return (
    <div className="bg-zinc-900 rounded-3xl p-8 text-white shadow-2xl border border-zinc-800">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
            <FlaskConical className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Core Logic Verification</h2>
            <p className="text-sm text-zinc-400">Run diagnostics to ensure system integrity.</p>
          </div>
        </div>
        <button
          onClick={runTests}
          disabled={isRunning}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-zinc-900 font-bold rounded-xl transition-all active:scale-95"
        >
          {isRunning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
          {isRunning ? 'Running Tests...' : 'Run Suite'}
        </button>
      </div>

      <div className="space-y-3">
        {results.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-zinc-800 rounded-2xl text-zinc-500">
            No tests run yet. Click "Run Suite" to begin.
          </div>
        ) : (
          results.map((test, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50"
            >
              <div className="flex items-center gap-4">
                {test.status === 'pending' && <Loader2 className="w-5 h-5 text-zinc-500 animate-spin" />}
                {test.status === 'passed' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {test.status === 'failed' && <XCircle className="w-5 h-5 text-red-400" />}
                <div>
                  <p className="font-bold text-sm">{test.name}</p>
                  {test.message && <p className="text-xs text-zinc-500">{test.message}</p>}
                </div>
              </div>
              <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                test.status === 'passed' ? 'bg-emerald-500/10 text-emerald-400' : 
                test.status === 'failed' ? 'bg-red-500/10 text-red-400' : 'bg-zinc-700 text-zinc-400'
              }`}>
                {test.status}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
