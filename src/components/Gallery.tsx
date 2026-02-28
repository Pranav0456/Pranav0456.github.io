import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Download, ImageIcon, Clock } from 'lucide-react';
import { GalleryItem } from '../types';

interface GalleryProps {
  items: GalleryItem[];
  onDelete: (id: string) => void;
  onDownload: (image: string) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ items, onDelete, onDownload }) => {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-12 text-center space-y-4">
        <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto text-zinc-300">
          <ImageIcon className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-zinc-900">Your Gallery is Empty</h3>
          <p className="text-sm text-zinc-500 max-w-xs mx-auto">Refine your first sketch to see it saved here automatically.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group relative bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="aspect-square relative overflow-hidden bg-zinc-50">
              <img
                src={item.image}
                alt={`Refined ${item.style}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 text-white">
                    <Clock className="w-3 h-3" />
                    <span className="text-[10px] font-medium">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onDownload(item.image)}
                      className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md rounded-full text-red-200 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between border-t border-zinc-100">
              <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">{item.style}</span>
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
