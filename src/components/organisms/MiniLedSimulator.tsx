'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Brightness Curve Component ---
interface Point {
  x: number;
  y: number;
}

interface BrightnessCurveEditorProps {
  points: Point[];
  setPoints: React.Dispatch<React.SetStateAction<Point[]>>;
  width: number;
  height: number;
}

const BrightnessCurveEditor: React.FC<BrightnessCurveEditorProps> = ({ points, setPoints, width, height }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingPointIndex, setDraggingPointIndex] = useState<number | null>(null);

  const getSVGCoordinates = (e: MouseEvent): Point => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const { x, y } = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    return { x, y };
  };

  const handleMouseDown = (index: number) => {
    setDraggingPointIndex(index);
  };

  const handleWindowMouseMove = useCallback((e: MouseEvent) => {
    if (draggingPointIndex === null) return;
    
    const { x, y } = getSVGCoordinates(e);
    
    const newX = Math.max(0, Math.min(width, x));
    const newY = Math.max(0, Math.min(height, y));

    setPoints(prevPoints => {
      const newPoints = [...prevPoints];
      if (draggingPointIndex > 0 && newX <= newPoints[draggingPointIndex - 1].x) return prevPoints;
      if (draggingPointIndex < newPoints.length - 1 && newX >= newPoints[draggingPointIndex + 1].x) return prevPoints;
      
      newPoints[draggingPointIndex] = { x: newX, y: newY };
      return newPoints;
    });
  }, [draggingPointIndex, width, height, setPoints]);

  const handleWindowMouseUp = useCallback(() => {
    setDraggingPointIndex(null);
  }, []);

  useEffect(() => {
    if (draggingPointIndex !== null) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
    } else {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [draggingPointIndex, handleWindowMouseMove, handleWindowMouseUp]);

  const pathData = `M ${points[0].x},${points[0].y} ` + points.slice(1).map(p => `L ${p.x},${p.y}`).join(' ');

  return (
    <div className="bg-white p-2 rounded-md shadow-inner">
      <svg 
        ref={svgRef} 
        width={width} 
        height={height} 
        className="border border-gray-300"
      >
        <line x1="0" y1={height / 2} x2={width} y2={height/2} stroke="#e0e0e0" strokeWidth="1"/>
        <line x1={width / 2} y1="0" x2={width/2} y2={height} stroke="#e0e0e0" strokeWidth="1"/>
        <path d={pathData} stroke="#4f46e5" strokeWidth="2" fill="none" />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="6"
            fill={i === 0 || i === points.length - 1 ? "#a0aec0" : "#4f46e5"}
            className={i > 0 && i < points.length - 1 ? "cursor-grab active:cursor-grabbing" : "cursor-not-allowed"}
            onMouseDown={() => (i > 0 && i < points.length - 1) && handleMouseDown(i)}
          />
        ))}
      </svg>
    </div>
  );
};


// --- Partition Detail Modal ---
interface PartitionDetailModalProps {
  data: {
    row: number;
    col: number;
    brightness: number;
    distribution: Uint8Array;
  };
  onClose: () => void;
}

const PartitionDetailModal: React.FC<PartitionDetailModalProps> = ({ data, onClose }) => {
  const maxCount = Math.max(...data.distribution, 1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">分区 ({data.row}, {data.col}) 详细信息</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl leading-none">&times;</button>
        </div>
        <p className="mb-4">计算后亮度值: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{data.brightness}</span></p>
        <div>
          <h4 className="text-md font-semibold mb-2">原始亮度分布图</h4>
          <div className="w-full h-48 bg-gray-100 p-2 border border-gray-300 flex items-end justify-start gap-px">
            {Array.from(data.distribution).map((count, index) => (
              <div
                key={index}
                className="w-full"
                style={{
                  height: `${(count / maxCount) * 100}%`,
                  backgroundColor: `rgb(${index}, ${index}, ${index})`,
                }}
                title={`亮度 ${index}: ${count} 像素`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0 (黑)</span>
            <span>255 (白)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Simulator Component ---
const MiniLedSimulator: React.FC = () => {
  type BrightnessAlgorithm = 'average' | 'mode';

  const [partitionCount, setPartitionCount] = useState<number>(2048);
  const [rows, setRows] = useState<number>(0);
  const [cols, setCols] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(255);
  const [grid, setGrid] = useState<number[][]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [brightnessAlgorithm, setBrightnessAlgorithm] = useState<BrightnessAlgorithm>('average');
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
  const [curvePoints, setCurvePoints] = useState<Point[]>([
    { x: 0, y: 255 },
    { x: 128, y: 128 },
    { x: 255, y: 0 },
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showGridLines, setShowGridLines] = useState(true);
  const [selectedPartition, setSelectedPartition] = useState<PartitionDetailModalProps['data'] | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const imageOffsetRef = useRef({ x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const brightnessMap = useCallback(() => {
    const map = new Uint8Array(256);
    const sortedPoints = [...curvePoints].sort((a, b) => a.x - b.x);

    for (let i = 0; i < 256; i++) {
      const inputX = i;
      let p1 = sortedPoints[0];
      let p2 = sortedPoints[sortedPoints.length - 1];

      for (let j = 0; j < sortedPoints.length - 1; j++) {
        if (inputX >= sortedPoints[j].x && inputX <= sortedPoints[j + 1].x) {
          p1 = sortedPoints[j];
          p2 = sortedPoints[j + 1];
          break;
        }
      }
      
      const t = (p2.x - p1.x) === 0 ? 0 : (inputX - p1.x) / (p2.x - p1.x);
      const outputY = p1.y + t * (p2.y - p1.y);
      map[i] = 255 - Math.max(0, Math.min(255, outputY));
    }
    return map;
  }, [curvePoints]);


  const handlePartitionChange = (e: React.FocusEvent<HTMLSpanElement>) => {
    const newCount = parseInt(e.currentTarget.textContent || '0', 10);
    setPartitionCount(isNaN(newCount) ? 0 : newCount);
  };

  useEffect(() => {
    if (partitionCount > 0) {
      const targetRatio = 16 / 9;
      let bestRows = 1;
      let bestCols = partitionCount;
      let bestDiff = Math.abs(bestCols / bestRows - targetRatio);

      for (let r = 1; r * r <= partitionCount; r++) {
        if (partitionCount % r === 0) {
          const c = partitionCount / r;
          let currentDiff = Math.abs(c / r - targetRatio);
          if (currentDiff < bestDiff) {
            bestDiff = currentDiff;
            bestRows = r;
            bestCols = c;
          }
          currentDiff = Math.abs(r / c - targetRatio);
          if (currentDiff < bestDiff) {
            bestDiff = currentDiff;
            bestRows = c;
            bestCols = r;
          }
        }
      }
      setRows(bestRows);
      setCols(bestCols);
    } else {
      setRows(0);
      setCols(0);
    }
  }, [partitionCount]);

  useEffect(() => {
    if (rows > 0 && cols > 0 && !uploadedImage) {
      setGrid(Array.from({ length: rows }, () => Array(cols).fill(0)));
    }
  }, [rows, cols, uploadedImage]);

  const processImage = useCallback((offsetX = 0, offsetY = 0) => {
    if (!uploadedImage || rows === 0 || cols === 0) return;
    const map = brightnessMap();

    const canvas = document.createElement('canvas');
    canvas.width = uploadedImage.width;
    canvas.height = uploadedImage.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(uploadedImage, offsetX, offsetY);
    // Wrap around drawing for seamless loop
    if (offsetX > 0) ctx.drawImage(uploadedImage, offsetX - uploadedImage.width, offsetY);
    if (offsetY > 0) ctx.drawImage(uploadedImage, offsetX, offsetY - uploadedImage.height);
    if (offsetX > 0 && offsetY > 0) ctx.drawImage(uploadedImage, offsetX - uploadedImage.width, offsetY - uploadedImage.height);


    const imageData = ctx.getImageData(0, 0, uploadedImage.width, uploadedImage.height);
    const { data, width, height } = imageData;

    const newGrid = Array.from({ length: rows }, () => Array(cols).fill(0));
    const cellWidth = width / cols;
    const cellHeight = height / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const startX = Math.floor(c * cellWidth);
        const startY = Math.floor(r * cellHeight);
        const endX = Math.floor(startX + cellWidth);
        const endY = Math.floor(startY + cellHeight);

        let totalBrightness = 0;
        const brightnessCounts = new Uint8Array(256).fill(0);
        let pixelCount = 0;

        for (let y = startY; y < endY; y++) {
          for (let x = startX; x < endX; x++) {
            const i = (y * width + x) * 4;
            const gray = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3);
            totalBrightness += gray;
            brightnessCounts[gray]++;
            pixelCount++;
          }
        }
        
        let rawBrightness = 0;
        if (brightnessAlgorithm === 'average') {
          rawBrightness = pixelCount > 0 ? totalBrightness / pixelCount : 0;
        } else { // mode with binning
          const BIN_SIZE = 16;
          const binCounts = new Array(Math.ceil(256 / BIN_SIZE)).fill(0);
          const binTotals = new Array(Math.ceil(256 / BIN_SIZE)).fill(0);

          for (let i = 0; i < 256; i++) {
            if (brightnessCounts[i] > 0) {
              const binIndex = Math.floor(i / BIN_SIZE);
              binCounts[binIndex] += brightnessCounts[i];
              binTotals[binIndex] += i * brightnessCounts[i];
            }
          }

          let dominantBinIndex = 0;
          let maxBinCount = 0;
          for (let i = 0; i < binCounts.length; i++) {
            if (binCounts[i] > maxBinCount) {
              maxBinCount = binCounts[i];
              dominantBinIndex = i;
            }
          }
          
          rawBrightness = maxBinCount > 0 ? binTotals[dominantBinIndex] / maxBinCount : 0;
        }
        newGrid[r][c] = map[Math.floor(rawBrightness)];
      }
    }
    setGrid(newGrid);
  }, [uploadedImage, rows, cols, brightnessAlgorithm, brightnessMap]);

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        imageOffsetRef.current.x = (imageOffsetRef.current.x + 1) % (uploadedImage?.width || 1);
        processImage(imageOffsetRef.current.x, imageOffsetRef.current.y);
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, uploadedImage, processImage]);

  useEffect(() => {
    if (uploadedImage) {
      processImage();
    }
  }, [uploadedImage, rows, cols, brightnessAlgorithm, curvePoints, processImage]);

  const updateCellBrightness = useCallback((rowIndex: number, colIndex: number) => {
    setIsPlaying(false);
    setUploadedImage(null);
    setGrid(prevGrid => {
      const newGrid = [...prevGrid];
      if (newGrid[rowIndex][colIndex] !== brightness) {
        newGrid[rowIndex] = [...newGrid[rowIndex]];
        newGrid[rowIndex][colIndex] = brightness;
        return newGrid;
      }
      return prevGrid;
    });
  }, [brightness]);

  const handleGridMouseDown = (e: React.MouseEvent, rowIndex: number, colIndex: number) => {
    if (uploadedImage) return; // Do not draw if an image is loaded
    e.preventDefault();
    setIsPlaying(false);
    setIsDragging(true);
    updateCellBrightness(rowIndex, colIndex);
  };

  const handleGridMouseEnter = (rowIndex: number, colIndex: number) => {
    if (isDragging) {
      updateCellBrightness(rowIndex, colIndex);
    }
  };

  useEffect(() => {
    const handleWindowMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mouseup', handleWindowMouseUp);
    }

    return () => {
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isDragging]);

  const handleReset = () => {
    setIsPlaying(false);
    setUploadedImage(null);
    setGrid(Array.from({ length: rows }, () => Array(cols).fill(0)));
    setCurvePoints([ { x: 0, y: 255 }, { x: 128, y: 128 }, { x: 255, y: 0 } ]);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsPlaying(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setUploadedImage(img);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const handlePlayToggle = () => {
    if (uploadedImage) {
      setIsPlaying(!isPlaying);
    }
  };

  const handlePartitionClick = (rowIndex: number, colIndex: number) => {
    if (!uploadedImage) return;

    const { width, height } = uploadedImage;
    const cellWidth = width / cols;
    const cellHeight = height / rows;

    const startX = Math.floor(colIndex * cellWidth);
    const startY = Math.floor(rowIndex * cellHeight);
    const endX = Math.floor(startX + cellWidth);
    const endY = Math.floor(startY + cellHeight);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(uploadedImage, 0, 0);
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const distribution = new Uint8Array(256).fill(0);
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        const i = (y * width + x) * 4;
        const gray = Math.floor((data[i] + data[i + 1] + data[i + 2]) / 3);
        distribution[gray]++;
      }
    }

    setSelectedPartition({
      row: rowIndex,
      col: colIndex,
      brightness: grid[rowIndex][colIndex],
      distribution,
    });
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        Mini-LED Simulator: <span
          contentEditable
          suppressContentEditableWarning={true}
          onBlur={handlePartitionChange}
          className="inline-block bg-white px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >{partitionCount}</span> Partitions
      </h2>
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div>
          <label htmlFor="brightness" className="block text-sm font-medium text-gray-700">
            画笔亮度 (0-255)
          </label>
          <input
            id="brightness"
            type="range"
            min="0"
            max="255"
            value={brightness}
            onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
            className="mt-1 block w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">亮度算法</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <button onClick={() => setBrightnessAlgorithm('average')} className={`px-3 py-1 border rounded-l-md ${brightnessAlgorithm === 'average' ? 'bg-indigo-500 text-white' : 'bg-white'}`}>平均值</button>
            <button onClick={() => setBrightnessAlgorithm('mode')} className={`px-3 py-1 border-t border-b border-r rounded-r-md ${brightnessAlgorithm === 'mode' ? 'bg-indigo-500 text-white' : 'bg-white'}`}>众数</button>
          </div>
        </div>
        <button
          onClick={handleUploadClick}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          上传图片
        </button>
        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
        <button
          onClick={handlePlayToggle}
          disabled={!uploadedImage}
          className={`px-4 py-2 text-white rounded-md ${!uploadedImage ? 'bg-gray-400 cursor-not-allowed' : isPlaying ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {isPlaying ? '停止' : '播放'}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          重置
        </button>
        <button
          onClick={() => setShowGridLines(!showGridLines)}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          {showGridLines ? '隐藏网格' : '显示网格'}
        </button>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">亮度映射曲线</label>
        <BrightnessCurveEditor points={curvePoints} setPoints={setCurvePoints} width={255} height={255} />
      </div>

      <div className="mb-2 text-sm text-gray-600">
        {`网格尺寸: ${rows} 行 x ${cols} 列 (总计: ${rows * cols} 分区)`}
      </div>
      <div
        ref={gridRef}
        className="grid border border-gray-400"
        style={{
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          aspectRatio: '16 / 9',
          cursor: 'crosshair',
          userSelect: 'none',
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cellBrightness, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-full h-full ${showGridLines ? 'border-r border-b border-gray-300' : ''}`}
              style={{
                backgroundColor: `rgb(${cellBrightness}, ${cellBrightness}, ${cellBrightness})`,
              }}
              onMouseDown={(e) => handleGridMouseDown(e, rowIndex, colIndex)}
              onMouseEnter={() => handleGridMouseEnter(rowIndex, colIndex)}
              onClick={() => handlePartitionClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
      {selectedPartition && <PartitionDetailModal data={selectedPartition} onClose={() => setSelectedPartition(null)} />}
    </div>
  );
};

export default MiniLedSimulator;