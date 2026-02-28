import React, { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Line, Rect } from 'react-konva';
import { DrawingLine } from '../types';

interface DrawingCanvasProps {
  onExport: (dataUrl: string) => void;
  width: number;
  height: number;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onExport, width, height }) => {
  const [tool, setTool] = useState<string>('pen');
  const [lines, setLines] = useState<DrawingLine[]>([]);
  const isDrawing = useRef(false);
  const stageRef = useRef<any>(null);

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y], color: '#000000', strokeWidth: tool === 'eraser' ? 20 : 2 }]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;

    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleUndo = () => {
    setLines(lines.slice(0, -1));
  };

  const handleClear = () => {
    setLines([]);
  };

  const handleExport = () => {
    if (stageRef.current) {
      const dataUrl = stageRef.current.toDataURL();
      onExport(dataUrl);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 bg-zinc-100 p-2 rounded-lg border border-zinc-200">
        <button
          onClick={() => setTool('pen')}
          className={`px-3 py-1 rounded ${tool === 'pen' ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-200'}`}
        >
          Pen
        </button>
        <button
          onClick={() => setTool('eraser')}
          className={`px-3 py-1 rounded ${tool === 'eraser' ? 'bg-zinc-800 text-white' : 'hover:bg-zinc-200'}`}
        >
          Eraser
        </button>
        <div className="w-px h-6 bg-zinc-300 mx-1" />
        <button
          onClick={handleUndo}
          className="px-3 py-1 rounded hover:bg-zinc-200"
        >
          Undo
        </button>
        <button
          onClick={handleClear}
          className="px-3 py-1 rounded hover:bg-zinc-200 text-red-600"
        >
          Clear
        </button>
        <div className="flex-1" />
        <button
          onClick={handleExport}
          className="px-4 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 font-medium transition-colors"
        >
          Use This Sketch
        </button>
      </div>

      <div className="border-2 border-zinc-200 rounded-xl overflow-hidden bg-white shadow-inner cursor-crosshair">
        <Stage
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          ref={stageRef}
        >
          <Layer>
            <Rect width={width} height={height} fill="white" />
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.color}
                strokeWidth={line.strokeWidth}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === 'eraser' ? 'destination-out' : 'source-over'
                }
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};
