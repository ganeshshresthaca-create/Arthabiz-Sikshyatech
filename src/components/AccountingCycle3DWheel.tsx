import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCw,
  ChevronRight,
  ChevronLeft,
  Compass,
  Coins,
  FileText,
  BookOpen,
  Scale,
  FileSpreadsheet,
  PenTool,
  PieChart,
  CheckCircle2,
  Calculator,
  Activity,
} from 'lucide-react';
import { ACCOUNTING_CYCLE_8_STEPS, AccountingCycleStep } from '../data/accountingCycleData';

interface Props {
  activeStep: number;
  onSelectStep: (stepNumber: number) => void;
}

export const AccountingCycle3DWheel: React.FC<Props> = ({
  activeStep,
  onSelectStep,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [viewAngle, setViewAngle] = useState<'3d' | 'top' | 'isometric'>('3d');
  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number }>({ x: 12, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-play timer for transaction flow simulation
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 3800 / speedMultiplier;
    const timer = setInterval(() => {
      onSelectStep(activeStep >= 8 ? 1 : activeStep + 1);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, activeStep, speedMultiplier, onSelectStep]);

  // Interactive mouse tilt for realistic 3D depth
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewAngle !== '3d' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const tiltX = Math.max(-20, Math.min(25, -y / 15 + 14));
    const tiltY = Math.max(-25, Math.min(25, x / 18));
    setMouseTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    if (viewAngle === '3d') {
      setMouseTilt({ x: 14, y: 0 });
    }
  };

  // Node positions on the circular orbital track
  // Radius R in SVG / container space: 185px (total diameter 400px inside 540x540 box)
  const radius = 175;
  const centerX = 260;
  const centerY = 260;

  // Calculate 8 node positions starting from Top (-90 degrees) clockwise
  const nodes = useMemo(() => {
    return ACCOUNTING_CYCLE_8_STEPS.map((item, idx) => {
      const angleDeg = -90 + idx * 45; // -90, -45, 0, 45, 90, 135, 180, 225
      const angleRad = (angleDeg * Math.PI) / 180;
      const x = centerX + radius * Math.cos(angleRad);
      const y = centerY + radius * Math.sin(angleRad);

      // Arrow position midpoint between this node and next node
      const nextAngleDeg = angleDeg + 45;
      const midAngleRad = ((angleDeg + 22.5) * Math.PI) / 180;
      const arrowX = centerX + (radius - 4) * Math.cos(midAngleRad);
      const arrowY = centerY + (radius - 4) * Math.sin(midAngleRad);
      const arrowRotation = angleDeg + 22.5 + 90; // tangent to circle

      return {
        ...item,
        x,
        y,
        angleDeg,
        arrowX,
        arrowY,
        arrowRotation,
      };
    });
  }, []);

  // Icon selector helper
  const renderStepIcon = (name: string, className: string = 'w-6 h-6') => {
    switch (name) {
      case 'Coins':
        return <Coins className={className} />;
      case 'FileText':
        return <FileText className={className} />;
      case 'BookOpen':
        return <BookOpen className={className} />;
      case 'Scale':
        return <Scale className={className} />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className={className} />;
      case 'PenTool':
        return <PenTool className={className} />;
      case 'PieChart':
        return <PieChart className={className} />;
      case 'CheckCircle2':
        return <CheckCircle2 className={className} />;
      default:
        return <Activity className={className} />;
    }
  };

  // Current active step object
  const currentStep = ACCOUNTING_CYCLE_8_STEPS.find((s) => s.step === activeStep) || ACCOUNTING_CYCLE_8_STEPS[0];

  // 3D perspective transform strings based on viewAngle
  const transformStyle = useMemo(() => {
    if (viewAngle === 'top') {
      return 'rotateX(0deg) rotateY(0deg)';
    }
    if (viewAngle === 'isometric') {
      return 'rotateX(35deg) rotateY(-18deg) rotateZ(4deg)';
    }
    return `rotateX(${mouseTilt.x}deg) rotateY(${mouseTilt.y}deg)`;
  }, [viewAngle, mouseTilt]);

  return (
    <div className="space-y-6">
      {/* Simulation Controls Toolbar */}
      <div className="bg-slate-900 text-white rounded-2xl p-3.5 sm:p-4 shadow-lg border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Play/Pause & Step Jump */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
            title={isPlaying ? 'Pause 3D Cycle Flow' : 'Start Continuous 3D Cycle Flow'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Flow</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play 3D Flow</span>
              </>
            )}
          </button>

          {/* Previous Step */}
          <button
            type="button"
            onClick={() => onSelectStep(activeStep <= 1 ? 8 : activeStep - 1)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition border border-slate-700 cursor-pointer"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Next Step */}
          <button
            type="button"
            onClick={() => onSelectStep(activeStep >= 8 ? 1 : activeStep + 1)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition border border-slate-700 cursor-pointer"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Speed & 3D Perspective Controls */}
        <div className="flex items-center gap-2.5 text-xs">
          {/* Speed Toggle */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 font-bold px-1.5">Speed:</span>
            {[1, 1.5, 2].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setSpeedMultiplier(spd)}
                className={`px-2 py-0.5 rounded-lg font-mono font-bold text-[10px] transition cursor-pointer ${
                  speedMultiplier === spd
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          {/* 3D Angle Views */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 font-bold px-1.5 flex items-center gap-1">
              <Compass className="w-3 h-3 text-slate-400" />
              <span>View:</span>
            </span>
            {(['3d', 'isometric', 'top'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewAngle(mode)}
                className={`px-2.5 py-0.5 rounded-lg font-bold text-[10px] uppercase tracking-wider transition cursor-pointer ${
                  viewAngle === mode
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Wheel Stage Area */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full min-h-[580px] sm:min-h-[620px] bg-gradient-to-b from-slate-900 via-[#0B132B] to-slate-950 rounded-3xl p-4 sm:p-6 overflow-hidden flex items-center justify-center select-none shadow-2xl border-2 border-slate-800/80 [perspective:1400px]"
      >
        {/* Spatial 3D Ambient Grid & Lighting Watermark */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
          style={{
            backgroundColor: currentStep.theme.hex,
            top: '20%',
            left: '30%',
          }}
        />

        {/* 3D Rotating Floor Plane */}
        <div
          className="relative w-[520px] h-[520px] max-w-full max-h-full transition-transform duration-300 ease-out [transform-style:preserve-3d]"
          style={{
            transform: transformStyle,
          }}
        >
          {/* Base SVG Ring with Flowing Animated Pulse Track and Curved Directional Arrows */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            viewBox="0 0 520 520"
          >
            <defs>
              {/* Radial Center Glow */}
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                <stop offset="70%" stopColor="#f8fafc" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.75" />
              </radialGradient>

              {/* Glowing animated particle gradient */}
              <linearGradient id="flowPulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#818cf8" stopOpacity="1" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.8" />
              </linearGradient>

              {/* Arrow Head Marker */}
              <marker
                id="arrowHead"
                markerWidth="8"
                markerHeight="8"
                refX="4"
                refY="4"
                orient="auto"
              >
                <path d="M1,1 L7,4 L1,7 L3,4 Z" fill="#94A3B8" />
              </marker>
            </defs>

            {/* Main Outer Orbital Track */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#1e293b"
              strokeWidth="6"
              strokeDasharray="4 8"
              className="opacity-40"
            />

            {/* Glowing Active Orbital Pulse Ring */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="url(#flowPulseGradient)"
              strokeWidth="3.5"
              strokeDasharray="25 65"
              className="opacity-70 animate-spin-slow"
              style={{ transformOrigin: '260px 260px' }}
            />

            {/* Inner Concentric Structural Rings */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius - 42}
              fill="none"
              stroke="#334155"
              strokeWidth="1.5"
              strokeDasharray="2 4"
              className="opacity-30"
            />
            <circle
              cx={centerX}
              cy={centerY}
              r={radius + 42}
              fill="none"
              stroke="#334155"
              strokeWidth="1"
              strokeDasharray="3 6"
              className="opacity-25"
            />

            {/* 8 Clockwise Directional Transition Arrows between nodes */}
            {nodes.map((node, i) => {
              const nextNode = nodes[(i + 1) % 8];
              // Arc path connecting node to nextNode along circumference
              const sweepFlag = 1; // clockwise
              const r = radius;

              // Arc endpoints slightly offset from center of nodes
              const startRad = (node.angleDeg * Math.PI) / 180;
              const endRad = (nextNode.angleDeg * Math.PI) / 180;

              const sx = centerX + r * Math.cos(startRad + 0.22);
              const sy = centerY + r * Math.sin(startRad + 0.22);
              const ex = centerX + r * Math.cos(endRad - 0.22);
              const ey = centerY + r * Math.sin(endRad - 0.22);

              const isActiveTransition = isPlaying && activeStep === node.step;

              return (
                <g key={`arrow-${node.step}`}>
                  {/* Subtle connecting curved guide arc */}
                  <path
                    d={`M ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey}`}
                    fill="none"
                    stroke={isActiveTransition ? node.theme.hex : '#475569'}
                    strokeWidth={isActiveTransition ? '3' : '1.5'}
                    strokeDasharray={isActiveTransition ? '4 4' : 'none'}
                    strokeOpacity={isActiveTransition ? 0.95 : 0.4}
                    className="transition-all duration-300"
                  />

                  {/* Directional Arrow Wedge positioned at tangent */}
                  <g
                    transform={`translate(${node.arrowX}, ${node.arrowY}) rotate(${node.arrowRotation})`}
                  >
                    <polygon
                      points="-5,-7 7,0 -5,7 -2,0"
                      fill={isActiveTransition ? '#F59E0B' : '#64748B'}
                      className={isActiveTransition ? 'animate-pulse' : ''}
                      filter={isActiveTransition ? 'drop-shadow(0 0 6px #F59E0B)' : undefined}
                    />
                  </g>
                </g>
              );
            })}
          </svg>

          {/* =================================================================== */}
          {/* CENTER 3D HUB: "The Accounting Cycle" (MATCHING UPLOADED USER IMAGE)*/}
          {/* =================================================================== */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full flex flex-col items-center justify-center text-center shadow-2xl transition-transform duration-300 [transform-style:preserve-3d]"
            style={{
              transform: 'translate(-50%, -50%) translateZ(28px)',
            }}
          >
            {/* Outer Thick Red/Coral Bezel matching User Image */}
            <div className="absolute inset-0 rounded-full border-[8px] border-[#DC2626] shadow-[0_0_24px_rgba(220,38,38,0.45)] pointer-events-none" />

            {/* Inner White / Sand Textured Hub Body */}
            <div className="w-[172px] h-[172px] rounded-full bg-white flex flex-col items-center justify-center p-3 text-center shadow-inner relative overflow-hidden">
              {/* Subtle background circular ripple */}
              <div className="absolute inset-0 bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:8px_8px] opacity-60 pointer-events-none" />

              {/* Center Graphic: Currency, Calculator, Document Exchange (matching User Image) */}
              <div className="relative mb-1 flex items-center justify-center">
                {/* Clockwise circular arrows symbol */}
                <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center shadow-2xs relative">
                  <RotateCw className="w-9 h-9 text-slate-800/80 animate-spin-slow" />
                  <div className="absolute inset-0 flex items-center justify-center gap-1 text-slate-800">
                    <Calculator className="w-3.5 h-3.5 text-blue-700" />
                    <FileText className="w-3.5 h-3.5 text-red-600" />
                  </div>
                </div>
              </div>

              {/* Main Heading Text: "The Accounting Cycle" */}
              <h2 className="text-slate-900 font-serif font-black text-sm sm:text-base leading-tight tracking-tight uppercase">
                The
                <br />
                <span className="text-lg sm:text-xl font-sans font-black text-slate-900 block tracking-tighter">
                  Accounting
                </span>
                Cycle
              </h2>

              {/* Small live cycle indicator */}
              <span className="mt-1 text-[9px] font-bold text-red-700 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                8 Stages
              </span>
            </div>
          </div>

          {/* =================================================================== */}
          {/* THE 8 CIRCULAR NODES (EXACT COLOR PALETTE & LABELS OF USER IMAGE)  */}
          {/* =================================================================== */}
          {nodes.map((node) => {
            const isActive = activeStep === node.step;

            return (
              <div
                key={node.step}
                onClick={() => onSelectStep(node.step)}
                className={`absolute w-28 sm:w-32 h-28 sm:h-32 -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-all duration-300 [transform-style:preserve-3d] group flex items-center justify-center`}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  transform: `translate(-50%, -50%) translateZ(${isActive ? '45px' : '15px'}) scale(${
                    isActive ? 1.12 : 1
                  })`,
                }}
                title={`Click to inspect Step ${node.step}: ${node.title}`}
              >
                {/* Outer Colored Ring Matching Diagram with Dynamic Glow on Active */}
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'border-[7px] shadow-[0_0_28px_rgba(255,255,255,0.6)] animate-pulse'
                      : 'border-[5px] group-hover:border-[6px] shadow-lg group-hover:scale-105'
                  }`}
                  style={{
                    borderColor: node.theme.hex,
                    boxShadow: isActive
                      ? `0 0 28px ${node.theme.hex}bb, 0 10px 20px rgba(0,0,0,0.5)`
                      : `0 4px 14px rgba(0,0,0,0.4)`,
                  }}
                />

                {/* Inner Node White Disc with Textured Backdrop */}
                <div className="w-[96px] sm:w-[110px] h-[96px] sm:h-[110px] rounded-full bg-white flex flex-col items-center justify-center p-2 text-center shadow-inner relative overflow-hidden transition-colors">
                  {/* Subtle inner grid texture */}
                  <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:6px_6px] opacity-40 pointer-events-none" />

                  {/* Step Icon */}
                  <div
                    className="p-1 rounded-md mb-0.5 transition-transform group-hover:scale-110"
                    style={{ color: node.theme.hex }}
                  >
                    {renderStepIcon(node.iconName, 'w-4 h-4 sm:w-5 sm:h-5')}
                  </div>

                  {/* Step Label Number */}
                  <div
                    className="text-[10px] sm:text-[11px] font-black tracking-tight leading-none"
                    style={{ color: node.theme.hex }}
                  >
                    Step {node.step}:
                  </div>

                  {/* Concise Step Action Title (from user's image) */}
                  <div className="text-[8px] sm:text-[8.5px] font-bold text-slate-800 leading-tight mt-0.5 line-clamp-2 px-1">
                    {node.step === 1 && 'Identify & analyze transactions.'}
                    {node.step === 2 && 'Record transactions in journal.'}
                    {node.step === 3 && 'Post to general ledger.'}
                    {node.step === 4 && 'Determine unadjusted TB.'}
                    {node.step === 5 && 'Analyze worksheet.'}
                    {node.step === 6 && 'Adjust entries & fix errors.'}
                    {node.step === 7 && 'Create financial statements.'}
                    {node.step === 8 && 'Close the books.'}
                  </div>

                  {/* Small Active Step Pin */}
                  {isActive && (
                    <div
                      className="absolute -top-1 w-2.5 h-2.5 rounded-full border border-white shadow-xs"
                      style={{ backgroundColor: node.theme.hex }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
