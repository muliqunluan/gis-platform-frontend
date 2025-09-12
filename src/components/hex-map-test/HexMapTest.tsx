'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Point, Hex, Graph, generateHexagonalMap, aStar, qrToWorld, worldToQR } from './hex-logic';

const HEX_SIZE = 30;

const HexMapTest = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [graph, setGraph] = useState<Graph>(new Graph());
  const [startHex, setStartHex] = useState<Hex | null>(null);
  const [endHex, setEndHex] = useState<Hex | null>(null);
  const [path, setPath] = useState<Hex[] | null>(null);
  const [mode, setMode] = useState<'start' | 'end' | 'obstacle'>('start');
  const [hoveredHex, setHoveredHex] = useState<Hex | null>(null);
  const [radius, setRadius] = useState(5); // Default radius

  // Function to draw a single hexagon
  const drawHex = (ctx: CanvasRenderingContext2D, center: Point, color: string) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 180 * (60 * i - 30);
      const x = center.x + HEX_SIZE * Math.cos(angle);
      const y = center.y + HEX_SIZE * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
  };

  // Initialize and update grid based on radius
  useEffect(() => {
    const hexes = generateHexagonalMap(radius);
    const newGraph = new Graph(hexes);
    setGraph(newGraph);
    // Reset state when radius changes
    setStartHex(null);
    setEndHex(null);
    setPath(null);
    setHoveredHex(null);
  }, [radius]);

  // Drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    // Center the grid in the canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);

    const neighbors = hoveredHex ? graph.getNeighbors(hoveredHex) : [];
    const neighborStrings = new Set(neighbors.map((n: Hex) => n.toString()));

    // Draw all hexes
    graph.hexes.forEach((hex: Hex) => {
      const center = qrToWorld(hex, HEX_SIZE);
      let color = '#f0f0f0';
      if (hex.isObstacle) color = '#333';
      if (startHex && startHex.toString() === hex.toString()) color = 'green';
      if (endHex && endHex.toString() === hex.toString()) color = 'red';
      if (hoveredHex && hoveredHex.toString() === hex.toString()) color = 'cyan';
      else if (neighborStrings.has(hex.toString())) color = 'lightblue';
      
      drawHex(ctx, center, color);
    });

    // Draw path
    if (path) {
      path.forEach(hex => {
        const center = qrToWorld(hex, HEX_SIZE);
        drawHex(ctx, center, 'rgba(0, 100, 255, 0.5)');
      });
    }
    
    ctx.restore();
  }, [graph, startHex, endHex, path, hoveredHex]);

  // Pathfinding effect
  useEffect(() => {
    if (startHex && endHex) {
      const foundPath = aStar(graph, startHex, endHex);
      setPath(foundPath);
    } else {
      setPath(null);
    }
  }, [graph, startHex, endHex]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    // Adjust click coordinates to be relative to the canvas center
    const x = event.clientX - rect.left - canvas.width / 2;
    const y = event.clientY - rect.top - canvas.height / 2;

    const qr = worldToQR({ x, y }, HEX_SIZE);
    
    // Hex rounding logic to find the correct hex from click coordinates
    let q = qr.q;
    let r = qr.r;
    let s = -q - r;

    let rq = Math.round(q);
    let rr = Math.round(r);
    let rs = Math.round(s);

    const q_diff = Math.abs(rq - q);
    const r_diff = Math.abs(rr - r);
    const s_diff = Math.abs(rs - s);

    if (q_diff > r_diff && q_diff > s_diff) {
        rq = -rr - rs;
    } else if (r_diff > s_diff) {
        rr = -rq - rs;
    }

    const clickedHex = graph.getHex({ q: rq, r: rr });

    if (!clickedHex) return;

    switch (mode) {
      case 'start':
        setStartHex(clickedHex);
        setMode('end'); // Automatically switch to end mode
        break;
      case 'end':
        setEndHex(clickedHex);
        setMode('obstacle'); // Automatically switch to obstacle mode
        break;
      case 'obstacle':
        const newHexesArray = Array.from(graph.hexes.values()).map((hex: Hex) => {
          if (hex.toString() === clickedHex.toString()) {
            // Cannot set start or end hex as an obstacle
            if (startHex?.toString() === hex.toString() || endHex?.toString() === hex.toString()) {
              return hex;
            }
            return new Hex(hex.q, hex.r, !hex.isObstacle);
          }
          return hex;
        });
        const newGraph = new Graph(newHexesArray);
        setGraph(newGraph);
        break;
    }
  };

  const reset = () => {
    setStartHex(null);
    setEndHex(null);
    setPath(null);
    setMode('start');
    // Reset all obstacles by regenerating the map
    const hexes = generateHexagonalMap(radius);
    const newGraph = new Graph(hexes);
    setGraph(newGraph);
  };

  const getModeText = () => {
    switch (mode) {
      case 'start': return '请点击地图设置起点';
      case 'end': return '请点击地图设置终点';
      case 'obstacle': return '请点击地图设置或取消障碍物';
      default: return '';
    }
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    // Adjust mouse coordinates to be relative to the canvas center
    const x = event.clientX - rect.left - canvas.width / 2;
    const y = event.clientY - rect.top - canvas.height / 2;

    const qr = worldToQR({ x, y }, HEX_SIZE);
    
    let q = qr.q, r = qr.r, s = -q - r;
    let rq = Math.round(q), rr = Math.round(r), rs = Math.round(s);
    const q_diff = Math.abs(rq - q), r_diff = Math.abs(rr - r), s_diff = Math.abs(rs - s);

    if (q_diff > r_diff && q_diff > s_diff) rq = -rr - rs;
    else if (r_diff > s_diff) rr = -rq - rs;

    const currentHoveredHex = graph.getHex({ q: rq, r: rr });
    if (currentHoveredHex?.toString() !== hoveredHex?.toString()) {
      setHoveredHex(currentHoveredHex || null);
    }
  };

  return (
    <div>
      <h1>六边形地图路径规划测试</h1>
      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={() => setMode('start')} style={{ fontWeight: mode === 'start' ? 'bold' : 'normal' }}>设置起点</button>
        <button onClick={() => setMode('end')} style={{ fontWeight: mode === 'end' ? 'bold' : 'normal' }}>设置终点</button>
        <button onClick={() => setMode('obstacle')} style={{ fontWeight: mode === 'obstacle' ? 'bold' : 'normal' }}>设置障碍物</button>
        <button onClick={reset} style={{ marginLeft: '10px' }}>全部重置</button>
        <div style={{ marginLeft: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="radius-slider">地图层数 (Radius): {radius}</label>
          <input
            type="range"
            id="radius-slider"
            min="0"
            max="10"
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value, 10))}
          />
        </div>
      </div>
      <p><b>当前模式:</b> {getModeText()}</p>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        <canvas
          ref={canvasRef}
          width="1000"
          height="700"
          style={{ border: '1px solid black', cursor: 'pointer' }}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
        />
        <div style={{ border: '1px solid #ccc', padding: '10px', width: '400px', height: '700px', overflowY: 'auto', fontFamily: 'monospace' }}>
          <h2>实时数据</h2>
          
          <h3>图结构 (悬停查看)</h3>
          {hoveredHex ? (
            <pre><code>
              悬停节点: ({hoveredHex.q}, {hoveredHex.r}){'\n'}
              邻居列表:{'\n'}
              {graph.getNeighbors(hoveredHex).map((hex: Hex) => `  (${hex.q}, ${hex.r})`).join('\n')}
            </code></pre>
          ) : (
            <p>请将鼠标悬停在地图上查看节点信息</p>
          )}

          <h3>当前状态</h3>
          <pre><code>
            模式: {mode}{'\n'}
            起点: {startHex ? startHex.toString() : 'N/A'}{'\n'}
            终点: {endHex ? endHex.toString() : 'N/A'}
          </code></pre>

          <details>
            <summary><b>完整图结构 (邻接列表)</b></summary>
            <pre style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: '#f5f5f5' }}><code>
              {Array.from(graph.hexes.values()).map((hex: Hex) => {
                const neighbors = graph.getNeighbors(hex);
                return `Node(${hex.q}, ${hex.r}):\n` + neighbors.map((n: Hex) => `  -> (${n.q}, ${n.r})`).join('\n');
              }).join('\n\n')}
            </code></pre>
          </details>

          <h3>路径数据 ({path ? path.length : 0} 步)</h3>
          {path && path.length > 0 ? (
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}><code>
              {path.map(p => `(${p.q}, ${p.r})`).join(' -> ')}
            </code></pre>
          ) : (
            <p>暂无路径</p>
          )}

          <h3>障碍物列表</h3>
          <pre><code>
            {Array.from(graph.hexes.values())
              .filter((hex: Hex) => hex.isObstacle)
              .map((hex: Hex) => `(${hex.q}, ${hex.r})`)
              .join('\n') || '无障碍物'}
          </code></pre>
        </div>
      </div>
    </div>
  );
};

export default HexMapTest;