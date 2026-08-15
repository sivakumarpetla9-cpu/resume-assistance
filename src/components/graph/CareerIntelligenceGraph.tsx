import React, { useState } from 'react';
import { useCareer } from '../../store/CareerContext';
import { Target, FileText, Cpu, Award, MessageSquareCode, BookOpen, Activity, ChevronRight } from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  subtext: string;
  icon: React.ElementType;
  x: number; // Percentage relative
  y: number;
  score?: number | string;
  color: string;
  screenTarget: string;
}

export const CareerIntelligenceGraph: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { activeJobTarget, atsDiagnostic, careerReadinessScore, setActiveScreen } = useCareer();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodes: GraphNode[] = [
    {
      id: 'job',
      label: 'TARGET JOB',
      subtext: `${activeJobTarget.title} — ${activeJobTarget.company}`,
      icon: Target,
      x: 50,
      y: 12,
      score: `${activeJobTarget.matchScore}% FIT`,
      color: '#35C6FF',
      screenTarget: 'job-intelligence'
    },
    {
      id: 'resume',
      label: 'RESUME',
      subtext: 'Parsed & Structured',
      icon: FileText,
      x: 18,
      y: 34,
      score: 'V1 TAILORED',
      color: '#4F7CFF',
      screenTarget: 'resume-studio'
    },
    {
      id: 'ats',
      label: 'ATS DIAGNOSTIC',
      subtext: 'Semantic Match',
      icon: Cpu,
      x: 82,
      y: 34,
      score: `${atsDiagnostic.overallScore}/100`,
      color: '#35D399',
      screenTarget: 'ats-console'
    },
    {
      id: 'skills',
      label: 'SKILL MATRIX',
      subtext: '4 Verified • 3 Gaps',
      icon: Award,
      x: 50,
      y: 48,
      score: '7 SKILLS',
      color: '#F2B84B',
      screenTarget: 'skill-gap'
    },
    {
      id: 'interview',
      label: 'AI INTERVIEW',
      subtext: 'Adaptive Simulator',
      icon: MessageSquareCode,
      x: 25,
      y: 72,
      score: '80% READY',
      color: '#35C6FF',
      screenTarget: 'interview-room'
    },
    {
      id: 'learning',
      label: 'LEARNING ROADMAP',
      subtext: 'Guided Progression',
      icon: BookOpen,
      x: 75,
      y: 72,
      score: '2/4 DONE',
      color: '#4F7CFF',
      screenTarget: 'learning-roadmap'
    },
    {
      id: 'readiness',
      label: 'CAREER READINESS',
      subtext: 'Global Operating Score',
      icon: Activity,
      x: 50,
      y: 90,
      score: `${careerReadinessScore}%`,
      color: '#35C6FF',
      screenTarget: 'command-center'
    }
  ];

  // Node Connections (Source -> Target)
  const connections = [
    { from: 'job', to: 'ats' },
    { from: 'job', to: 'skills' },
    { from: 'resume', to: 'ats' },
    { from: 'resume', to: 'skills' },
    { from: 'ats', to: 'interview' },
    { from: 'skills', to: 'interview' },
    { from: 'skills', to: 'learning' },
    { from: 'interview', to: 'readiness' },
    { from: 'learning', to: 'readiness' }
  ];

  const getNodePos = (id: string) => {
    const node = nodes.find(n => n.id === id);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  return (
    <div className={`relative w-full ${compact ? 'h-[360px]' : 'h-[520px]'} bg-[#070A0F]/60 border border-[#1C2633] rounded-xl overflow-hidden p-4 select-none`}>
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      {/* Header Tag */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-1 bg-[#0C1118]/80 border border-[#1C2633] rounded-full text-xs font-mono text-[#35C6FF]">
        <span className="w-2 h-2 rounded-full bg-[#35C6FF] animate-pulse" />
        CAREER INTELLIGENCE GRAPH v2.4
      </div>

      {/* SVG Connections Canvas */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#35C6FF" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4F7CFF" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="lineActive" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#35C6FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#35D399" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {connections.map((conn, idx) => {
          const fromPos = getNodePos(conn.from);
          const toPos = getNodePos(conn.to);
          const isActive = hoveredNode === conn.from || hoveredNode === conn.to;

          return (
            <g key={idx}>
              {/* Static Background Connection Line */}
              <line
                x1={`${fromPos.x}%`}
                y1={`${fromPos.y}%`}
                x2={`${toPos.x}%`}
                y2={`${toPos.y}%`}
                stroke={isActive ? "url(#lineActive)" : "url(#lineGrad)"}
                strokeWidth={isActive ? 2.5 : 1.5}
                strokeDasharray={isActive ? "none" : "4 4"}
                className="transition-all duration-300"
              />

              {/* Animated Glowing Pulse particle along connection line */}
              <circle r={isActive ? 3 : 2} fill="#35C6FF" className="animate-pulse">
                <animateMotion
                  path={`M ${fromPos.x * 8} ${fromPos.y * 5} L ${toPos.x * 8} ${toPos.y * 5}`}
                  dur={`${3 + (idx % 3)}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* Interactive Rendered Nodes */}
      {nodes.map(node => {
        const Icon = node.icon;
        const isHovered = hoveredNode === node.id;
        const isCoreReadiness = node.id === 'readiness';

        return (
          <div
            key={node.id}
            onClick={() => setActiveScreen(node.screenTarget)}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group transition-all duration-300 ${
              isHovered ? 'scale-105' : ''
            }`}
          >
            {/* Node Card Container */}
            <div className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl backdrop-blur-md border transition-all duration-300 ${
              isCoreReadiness
                ? 'bg-[#111822]/90 border-[#35C6FF]/60 shadow-[0_0_25px_rgba(53,198,255,0.25)]'
                : isHovered
                ? 'bg-[#151D28] border-[#35C6FF] shadow-[0_0_15px_rgba(53,198,255,0.2)]'
                : 'bg-[#0C1118]/90 border-[#1C2633] hover:border-[#35C6FF]/50'
            }`}>
              {/* Icon Container */}
              <div
                className="p-2 rounded-lg flex items-center justify-center transition-colors"
                style={{ backgroundColor: `${node.color}15`, color: node.color }}
              >
                <Icon className="w-4 h-4" />
              </div>

              {/* Text Info */}
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono tracking-wider font-semibold text-[#F3F5F7] group-hover:text-[#35C6FF] transition-colors">
                    {node.label}
                  </span>
                  {node.score && (
                    <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-[#151D28] border border-[#1C2633] text-[#35C6FF]">
                      {node.score}
                    </span>
                  )}
                </div>
                {!compact && (
                  <span className="text-[10px] text-[#A7B0BC] truncate max-w-[140px]">
                    {node.subtext}
                  </span>
                )}
              </div>

              {/* Action indicator */}
              <ChevronRight className="w-3.5 h-3.5 text-[#66717F] group-hover:text-[#35C6FF] group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
