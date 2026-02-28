import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Wand2, Eraser, Pen, RotateCcw, Image as ImageIcon, Loader2, Download, Trash2, Github, Palette, Sparkles, HelpCircle, LayoutGrid, FlaskConical } from 'lucide-react';
import { DrawingCanvas } from './components/DrawingCanvas';
import { refineSketch } from './services/geminiService';
import { AppState, ArtStyle, GalleryItem } from './types';
import { Tutorial } from './components/Tutorial';
import { Gallery } from './components/Gallery';
import { TestingSuite } from './components/TestingSuite';

const ART_STYLES: { id: ArtStyle; label: string; icon: string }[] = [
  { id: 'pencil', label: 'Pencil Sketch', icon: '✏️' },
  { id: 'charcoal', label: 'Charcoal', icon: '🌑' },
  { id: 'watercolor', label: 'Watercolor', icon: '🎨' },
  { id: 'oil', label: 'Oil Painting', icon: '🖼️' },
  { id: 'digital', label: 'Digital Art', icon: '💻' },
  { id: 'minimalist', label: 'Minimalist', icon: '✨' },
];

export default function App() {
  const [state, setState] = useState<AppState>({
    isRefining: false,
    resultImage: null,
    error: null,
    selectedStyle: 'pencil',
  });
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [refinementDetails, setRefinementDetails] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'draw' | 'upload'>('draw');
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [showTesting, setShowTesting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setInputImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRefine = async () => {
    if (!inputImage) return;

    setState(prev => ({ ...prev, isRefining: true, error: null }));
    try {
      const result = await refineSketch(inputImage, state.selectedStyle, refinementDetails);
      setState(prev => ({ ...prev, resultImage: result, isRefining: false }));
      
      // Add to gallery
      const newItem: GalleryItem = {
        id: Math.random().toString(36).substring(7),
        image: result,
        style: state.selectedStyle,
        timestamp: Date.now(),
      };
      setGallery(prev => [newItem, ...prev]);
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message || 'Failed to refine sketch', isRefining: false }));
    }
  };

  const handleDownload = (image?: string) => {
    const targetImage = image || state.resultImage;
    if (targetImage) {
      const link = document.createElement('a');
      link.href = targetImage;
      link.download = 'refined-sketch.png';
      link.click();
    }
  };

  const handleDeleteGalleryItem = (id: string) => {
    setGallery(prev => prev.filter(item => item.id !== id));
  };

  const reset = () => {
    setInputImage(null);
    setState({
      isRefining: false,
      resultImage: null,
      error: null,
      selectedStyle: 'pencil',
    });
    setRefinementDetails('');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans selection:bg-zinc-200">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">SketchRefine</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsTutorialOpen(true)}
              className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
              title="Help & Tutorial"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowTesting(!showTesting)}
              className={`p-2 transition-colors ${showTesting ? 'text-emerald-600' : 'text-zinc-400 hover:text-zinc-900'}`}
              title="System Diagnostics"
            >
              <FlaskConical className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-zinc-200 mx-1" />
            <button 
              onClick={reset}
              className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              Start Over
            </button>
            <a href="#" className="text-zinc-400 hover:text-zinc-900 transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 space-y-24">
        {/* Hero / Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Input Section */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Input Sketch</h2>
              <p className="text-zinc-500">Draw your idea or upload an existing sketch to begin.</p>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="flex border-b border-zinc-100">
                <button
                  onClick={() => setActiveTab('draw')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'draw' ? 'bg-zinc-50 text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Pen className="w-4 h-4" />
                    Draw
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'upload' ? 'bg-zinc-50 text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload
                  </div>
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'draw' ? (
                  <DrawingCanvas 
                    width={500} 
                    height={500} 
                    onExport={(data) => setInputImage(data)} 
                  />
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-zinc-200 rounded-xl flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-zinc-400 hover:bg-zinc-50 transition-all group"
                  >
                    {inputImage ? (
                      <div className="relative w-full h-full p-4">
                        <img src={inputImage} alt="Input" className="w-full h-full object-contain rounded-lg" />
                        <button 
                          onClick={(e) => { e.stopPropagation(); setInputImage(null); }}
                          className="absolute top-6 right-6 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <ImageIcon className="w-8 h-8 text-zinc-400" />
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-zinc-900">Click to upload</p>
                          <p className="text-sm text-zinc-500">PNG, JPG up to 10MB</p>
                        </div>
                      </>
                    )}
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      className="hidden" 
                      accept="image/*"
                    />
                  </div>
                )}
              </div>
            </div>

            {inputImage && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Style Selector */}
                <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 space-y-4">
                  <div className="flex items-center gap-2 text-zinc-900 font-semibold">
                    <Palette className="w-4 h-4" />
                    <h3>Artist Style</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ART_STYLES.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setState(prev => ({ ...prev, selectedStyle: style.id }))}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                          state.selectedStyle === style.id 
                            ? 'border-zinc-900 bg-zinc-900 text-white shadow-md' 
                            : 'border-zinc-100 bg-zinc-50 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-100'
                        }`}
                      >
                        <span className="text-2xl">{style.icon}</span>
                        <span className="text-xs font-bold">{style.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 space-y-4">
                  <div className="flex items-center gap-2 text-zinc-900 font-semibold">
                    <Sparkles className="w-4 h-4" />
                    <h3>Refinement Details</h3>
                  </div>
                  <textarea
                    value={refinementDetails}
                    onChange={(e) => setRefinementDetails(e.target.value)}
                    placeholder="E.g., 'Make it look like a charcoal drawing', 'Add more detail to the background', 'Keep it minimalist'..."
                    className="w-full h-24 p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all resize-none placeholder:text-zinc-400"
                  />
                  <p className="text-xs text-zinc-400 italic">
                    Optional: Describe specific changes or styles you'd like to see.
                  </p>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleRefine}
                    disabled={state.isRefining}
                    className="group relative px-8 py-4 bg-zinc-900 text-white rounded-full font-bold text-lg shadow-xl hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                  >
                    <div className="flex items-center gap-3">
                      {state.isRefining ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <Wand2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                      )}
                      {state.isRefining ? 'Refining...' : 'Convert to Professional Sketch'}
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </section>

          {/* Output Section */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Refined Result</h2>
              <p className="text-zinc-500">Your professional artwork will appear here.</p>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm aspect-square relative overflow-hidden group">
              <AnimatePresence mode="wait">
                {state.isRefining ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-50/80 backdrop-blur-sm z-10"
                  >
                    <div className="relative">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 border-4 border-zinc-100 border-t-zinc-900 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      >
                        <Wand2 className="w-10 h-10 text-zinc-900" />
                      </motion.div>
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-8 text-center"
                    >
                      <p className="font-bold text-xl text-zinc-900">Refining your masterpiece...</p>
                      <p className="text-sm text-zinc-500 mt-2">Applying {ART_STYLES.find(s => s.id === state.selectedStyle)?.label} style</p>
                      <div className="mt-6 w-48 h-1.5 bg-zinc-200 rounded-full overflow-hidden mx-auto">
                        <motion.div 
                          initial={{ x: "-100%" }}
                          animate={{ x: "0%" }}
                          transition={{ duration: 8, ease: "easeOut" }}
                          className="w-full h-full bg-zinc-900"
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                ) : state.resultImage ? (
                  <motion.div 
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full h-full p-4 flex flex-col"
                  >
                    <div className="flex-1 relative rounded-xl overflow-hidden border border-zinc-100 shadow-inner bg-zinc-50">
                      <img 
                        src={state.resultImage} 
                        alt="Refined" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-600">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium">Refinement Complete</span>
                      </div>
                      <button
                        onClick={() => handleDownload()}
                        className="flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-sm font-semibold transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-zinc-300"
                  >
                    <ImageIcon className="w-20 h-20 mb-4 opacity-20" />
                    <p className="font-medium">Waiting for input...</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {state.error && (
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  {state.error}
                </div>
              )}
            </div>

            {/* Features/Tips */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                <h4 className="font-bold text-sm mb-1">Pro Tip</h4>
                <p className="text-xs text-zinc-500">Clear lines and simple shapes work best for the AI to interpret your vision.</p>
              </div>
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                <h4 className="font-bold text-sm mb-1">Styles</h4>
                <p className="text-xs text-zinc-500">The AI defaults to a professional pencil sketch style with master-level shading.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Testing Suite Section */}
        <AnimatePresence>
          {showTesting && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <TestingSuite />
            </motion.section>
          )}
        </AnimatePresence>

        {/* Gallery Section */}
        <section className="space-y-12">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center">
                  <LayoutGrid className="w-6 h-6 text-zinc-900" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Your Gallery</h2>
              </div>
              <p className="text-zinc-500">A collection of your refined masterpieces.</p>
            </div>
            <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
              {gallery.length} Items
            </div>
          </div>
          
          <Gallery 
            items={gallery} 
            onDelete={handleDeleteGalleryItem} 
            onDownload={handleDownload} 
          />
        </section>
      </main>

      <Tutorial isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />

      <footer className="border-t border-zinc-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <p className="text-zinc-400 text-sm">Powered by Gemini 2.5 Flash Image & React Konva</p>
          <div className="flex justify-center gap-6">
            <a href="#" className="text-zinc-400 hover:text-zinc-900 text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-zinc-400 hover:text-zinc-900 text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-zinc-400 hover:text-zinc-900 text-sm transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
