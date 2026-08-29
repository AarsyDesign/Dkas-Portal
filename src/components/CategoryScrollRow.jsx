import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategoryScrollRow({
  categories = [],
  selectedCategory = 'Semua',
  onSelectCategory,
  activeColor = 'bg-emerald-600 text-white shadow-md'
}) {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const checkScrollability = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [categories]);

  // Scroll active item into view
  useEffect(() => {
    if (!containerRef.current) return;
    const activeBtn = containerRef.current.querySelector('[data-active="true"]');
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedCategory]);

  const scroll = (direction) => {
    if (!containerRef.current) return;
    const scrollAmount = 240;
    containerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const handleWheel = (e) => {
    if (!containerRef.current) return;
    if (e.deltaY !== 0) {
      containerRef.current.scrollLeft += e.deltaY;
      checkScrollability();
    }
  };

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeftState(containerRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeftState - walk;
    checkScrollability();
  };

  return (
    <div className="relative group/scroll flex items-center w-full">
      {/* Left Scroll Button */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll('left')}
          className="absolute -left-2 z-10 p-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hidden sm:flex items-center justify-center"
          title="Geser ke kiri"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Category Chips Container */}
      <div
        ref={containerRef}
        onScroll={checkScrollability}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveOrUp}
        onMouseUp={handleMouseLeaveOrUp}
        onMouseMove={handleMouseMove}
        className={`flex items-center space-x-1.5 overflow-x-auto py-1 px-0.5 text-xs no-scrollbar select-none cursor-grab active:cursor-grabbing w-full ${
          isDragging ? 'scroll-auto' : 'scroll-smooth'
        }`}
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              data-active={isActive ? 'true' : 'false'}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl font-bold shrink-0 btn-press transition-all duration-150 ${
                isActive
                  ? activeColor
                  : 'bg-slate-100 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/80 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Right Scroll Button */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll('right')}
          className="absolute -right-2 z-10 p-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shadow-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hidden sm:flex items-center justify-center"
          title="Geser ke kanan"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
