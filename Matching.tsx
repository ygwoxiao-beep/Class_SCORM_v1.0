import { useDrag, useDrop } from 'react-dnd';
import { Zap, Circle, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface MatchPair {
  left: string;
  right: string;
}

interface MatchingProps {
  question: string;
  leftItems: MatchPair[];
  rightItems: string[];
  matches: { [key: number]: number };
  onChange: (leftIndex: number, rightIndex: number) => void;
}

function LeftItem({ item, index, isMatched }: { item: MatchPair; index: number; isMatched: boolean }) {
  return (
    <div className={`p-4 rounded-xl border-2 ${isMatched ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-white'}`}>
      {item.left}
    </div>
  );
}

function RightItem({ 
  item, 
  index, 
  onDrop, 
  isMatched 
}: { 
  item: string; 
  index: number; 
  onDrop: (leftIndex: number) => void;
  isMatched: boolean;
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'LEFT_ITEM',
    drop: (draggedItem: { index: number }) => {
      onDrop(draggedItem.index);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [onDrop]);

  return (
    <div
      ref={drop}
      className={`p-4 rounded-xl border-2 transition-colors cursor-pointer ${
        isOver ? 'border-blue-500 bg-blue-50' : isMatched ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-white'
      }`}
    >
      {item}
    </div>
  );
}

const colorPairs = [
  { gradient: 'from-pink-400 to-purple-500', glow: 'shadow-pink-300', star: '#ec4899' },
  { gradient: 'from-cyan-400 to-blue-500', glow: 'shadow-cyan-300', star: '#06b6d4' },
  { gradient: 'from-amber-400 to-orange-500', glow: 'shadow-amber-300', star: '#f59e0b' },
  { gradient: 'from-emerald-400 to-green-500', glow: 'shadow-emerald-300', star: '#10b981' },
];

export function Matching({ question, leftItems, rightItems, matches, onChange }: MatchingProps) {
  const handleConnect = (leftIndex: number, rightIndex: number) => {
    onChange(leftIndex, rightIndex);
  };

  return (
    <div className="space-y-6">
      <div className="text-lg leading-relaxed">{question}</div>
      <div className="relative">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 rounded-2xl -z-10 opacity-50"></div>
        
        {/* 提示文字 */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-purple-600 mb-4 flex items-center gap-2 px-4 pt-4"
        >
          <Zap className="w-4 h-4" />
          点击左侧项目，再点击右侧对应项目进行连线，或直接拖拽连接！
        </motion.div>

        <div className="grid grid-cols-2 gap-12 p-4 relative">
          {/* 连接线 */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            {Object.entries(matches).map(([leftIdx, rightIdx]) => {
              const leftIndex = parseInt(leftIdx);
              const color = colorPairs[leftIndex % colorPairs.length];
              // 简化连接线绘制
              const y1 = leftIndex * 72 + 36;
              const y2 = (rightIdx as number) * 72 + 36;
              return (
                <motion.g
                  key={`line-${leftIndex}-${rightIdx}`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <defs>
                    <linearGradient id={`gradient-${leftIndex}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M 0,${y1} Q ${window.innerWidth / 4},${(y1 + y2) / 2} ${window.innerWidth / 2},${y2}`}
                    stroke={`url(#gradient-${leftIndex})`}
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))' }}
                  />
                  {/* 起点装饰 */}
                  <circle cx="0" cy={y1} r="6" fill={color.star} />
                  {/* 终点装饰 */}
                  <circle cx={window.innerWidth / 2} cy={y2} r="6" fill={color.star} />
                </motion.g>
              );
            })}
          </svg>

          {/* 左侧项目 */}
          <div className="space-y-4 relative z-10">
            {leftItems.map((item, index) => {
              const [{ isDragging }, drag] = useDrag(() => ({
                type: 'LEFT_ITEM',
                item: { index },
                collect: (monitor) => ({
                  isDragging: !!monitor.isDragging(),
                }),
              }), [index]);

              const isMatched = matches[index] !== undefined;
              const color = colorPairs[index % colorPairs.length];

              return (
                <motion.div
                  key={index}
                  ref={drag}
                  onClick={() => {
                    const selected = document.querySelector('.matching-selected');
                    if (selected) {
                      selected.classList.remove('matching-selected');
                    }
                    const el = document.getElementById(`left-${index}`);
                    el?.classList.add('matching-selected');
                  }}
                  id={`left-${index}`}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-4 rounded-xl cursor-pointer transition-all ${
                    isDragging ? 'opacity-50' : ''
                  } ${
                    isMatched 
                      ? `bg-gradient-to-r ${color.gradient} text-white shadow-lg ${color.glow}` 
                      : 'bg-white border-2 border-purple-200 hover:border-purple-400 shadow-md hover:shadow-lg'
                  }`}
                  style={{ touchAction: 'none' }}
                >
                  <div className="flex items-center gap-3">
                    {isMatched ? (
                      <Star className="w-5 h-5 fill-current" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                    <span className={isMatched ? 'font-medium' : ''}>{item.left}</span>
                  </div>
                  {isMatched && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs"
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* 右侧项目 */}
          <div className="space-y-4 relative z-10">
            {rightItems.map((item, index) => {
              const isMatched = Object.values(matches).includes(index);
              const matchedLeftIndex = Object.entries(matches).find(([_, val]) => val === index)?.[0];
              const color = matchedLeftIndex ? colorPairs[parseInt(matchedLeftIndex) % colorPairs.length] : null;

              return (
                <motion.div
                  key={index}
                  onClick={() => {
                    const selected = document.querySelector('.matching-selected');
                    if (selected) {
                      const leftIndex = parseInt(selected.id.replace('left-', ''));
                      handleConnect(leftIndex, index);
                      selected.classList.remove('matching-selected');
                    }
                  }}
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-4 rounded-xl cursor-pointer transition-all ${
                    isMatched && color
                      ? `bg-gradient-to-r ${color.gradient} text-white shadow-lg ${color.glow}` 
                      : 'bg-white border-2 border-blue-200 hover:border-blue-400 shadow-md hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isMatched ? (
                      <Star className="w-5 h-5 fill-current" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                    <span className={isMatched ? 'font-medium' : ''}>{item}</span>
                  </div>
                  {isMatched && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs"
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* 进度显示 */}
        <motion.div 
          className="mt-6 px-4 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(Object.keys(matches).length / leftItems.length) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
              />
            </div>
            <div className="text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {Object.keys(matches).length} / {leftItems.length}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
