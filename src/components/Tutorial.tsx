import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Pen, Wand2, Download, Palette, Sparkles } from 'lucide-react';

interface TutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ isOpen, onClose }) => {
  const steps = [
    {
      icon: <Pen className="w-6 h-6" />,
      title: "1. Create Your Sketch",
      description: "Use the drawing tools to sketch your idea, or upload an existing image from your device."
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "2. Choose a Style",
      description: "Select from various artistic styles like Watercolor, Charcoal, or Oil Painting to define the final look."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "3. Add Details",
      description: "Optionally add text instructions to guide the AI on specific details or moods you want to capture."
    },
    {
      icon: <Wand2 className="w-6 h-6" />,
      title: "4. Refine",
      description: "Hit the convert button and watch as our AI transforms your rough doodle into a professional masterpiece."
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-zinc-900">How to use SketchRefine</h2>
                <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-zinc-400" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-zinc-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900 mb-1">{step.title}</h3>
                      <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-zinc-100 flex justify-center">
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-zinc-900 text-white rounded-full font-bold hover:bg-zinc-800 transition-all active:scale-95"
                >
                  Got it, let's draw!
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
