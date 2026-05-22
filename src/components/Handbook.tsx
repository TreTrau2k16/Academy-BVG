/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Search, Filter, ShieldCheck, Heart, Sparkles, ChevronRight, Compass } from 'lucide-react';
import { handbooks as staticHandbooks } from '../data/lessonsData';

interface HandbookProps {
  onClose: () => void;
  onGrantBonusXp?: () => void;
  dynamicHandbooks?: any[];
}

export default function Handbook({ onClose, onGrantBonusXp, dynamicHandbooks }: HandbookProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const books = dynamicHandbooks && dynamicHandbooks.length > 0 ? dynamicHandbooks : staticHandbooks;
  
  const [selectedBookId, setSelectedBookId] = useState<string>(() => books[0]?.id || '');
  const [hasClaimedBonusForBook, setHasClaimedBonusForBook] = useState<{ [id: string]: boolean }>({});

  const filteredBooks = books.filter((book: any) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          book.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeBook = books.find((b: any) => b.id === selectedBookId) || books[0];

  React.useEffect(() => {
    if (activeBook && activeBook.id !== selectedBookId) {
      setSelectedBookId(activeBook.id);
    }
  }, [books, selectedBookId, activeBook]);

  const handleClaimBonus = (bookId: string) => {
    if (hasClaimedBonusForBook[bookId]) return;
    if (onGrantBonusXp) {
      onGrantBonusXp();
      setHasClaimedBonusForBook(prev => ({ ...prev, [bookId]: true }));
    }
  };

  const categories = [
    { id: 'all', label: 'Tất cả tài liệu 📚' },
    { id: 'culture', label: 'Văn hóa & Chính sách 🏛️' },
    { id: 'safety', label: 'An Toàn HSE 🛡️' },
    { id: 'technical', label: 'Kỹ Thuật Thi Công 📐' }
  ];

  return (
    <div id="handbook-viewport" className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Top action header bar */}
      <header className="sticky top-0 bg-white border-b border-slate-200 h-18 shrink-0 flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 text-lg">Tủ Sách Tri Thức Bách Việt</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Internal Handbook Resource</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm px-6 py-2.5 rounded-xl cursor-pointer shadow-md transition-all active:scale-95"
        >
          Trở Lại Bản Đồ Học ↩️
        </button>
      </header>

      {/* Main double pane section */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-[calc(100vh-72px)]">
        
        {/* LEFT COMPONENT: Catalog Navigation & Fast filtration */}
        <div className="w-full md:w-80 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col overflow-y-auto shrink-0 p-4 gap-4">
          
          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm tài liệu..."
              className="w-full bg-slate-50 border-2 border-slate-100 focus:border-orange-600 outline-none pl-9 pr-4 py-2 text-xs font-bold rounded-xl text-slate-800 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Category Vertical Pills */}
          <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 border-b border-slate-100 md:border-b-0">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-2.5 rounded-xl text-left font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === c.id 
                    ? 'bg-orange-50 text-orange-700 border-l-4 border-l-orange-600' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Book Catalog list */}
          <div className="flex flex-col gap-2.5 pt-2 flex-1">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Mục lục tài liệu ({filteredBooks.length})</span>
            {filteredBooks.map((book) => {
              const isActive = book.id === selectedBookId;
              const isClaimed = hasClaimedBonusForBook[book.id];
              return (
                <button
                  key={book.id}
                  onClick={() => setSelectedBookId(book.id)}
                  className={`p-3.5 rounded-xl border-2 text-left cursor-pointer transition-all flex flex-col gap-2 ${
                    isActive 
                      ? 'bg-orange-50 border-orange-600 shadow-sm' 
                      : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <p className={`text-xs font-extrabold leading-snug ${isActive ? 'text-orange-950' : 'text-slate-800'}`}>{book.title}</p>
                  
                  <div className="flex justify-between items-center w-full">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 uppercase tracking-wider">{book.category}</span>
                    {onGrantBonusXp && !isClaimed && (
                      <span className="text-[9px] font-extrabold text-orange-600 flex items-center gap-0.5 animate-pulse">
                        <Sparkles className="w-2.5 h-2.5 fill-current" />
                        +20 XP
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* RIGHT COMPONENT: Detailed Reading Pane */}
        <div id="reading-pane" className="flex-1 bg-white overflow-y-auto p-6 md:p-10 select-text">
          {activeBook ? (
            <div className="max-w-2xl mx-auto flex flex-col gap-6">
              
              {/* Category tag */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-black uppercase tracking-wider text-orange-700 bg-orange-50 border border-orange-200/50 px-3 py-1 rounded-full">
                  ⚡ {activeBook.category.toUpperCase()}
                </span>
                {activeBook.tags.map(t => (
                  <span key={t} className="text-xs text-slate-400 font-bold">#{t}</span>
                ))}
              </div>

              {/* Title & Author */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug tracking-tight">
                  {activeBook.title}
                </h1>
                <p className="text-xs text-slate-400 font-bold mt-2 uppercase tracking-wider">Tổng cục huấn luyện ban nhân sự | ban hành nội bộ</p>
              </div>

              {/* Interactive XP BONUS REFILL EASTER EGG widget - extremely smart */}
              {onGrantBonusXp && (
                <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-4.5 text-white shadow-lg shadow-orange-600/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-6 h-6 text-amber-200 fill-current animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base">Mở rộng kiến thức thực tế ✨</h4>
                      <p className="text-xs text-orange-100 mt-1">Đọc kỹ cẩm nang dự án để tích lũy thêm điểm thưởng thi đua nội bộ!</p>
                    </div>
                  </div>

                  <button
                    disabled={hasClaimedBonusForBook[activeBook.id]}
                    onClick={() => handleClaimBonus(activeBook.id)}
                    className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md shrink-0 cursor-pointer ${
                      hasClaimedBonusForBook[activeBook.id]
                        ? 'bg-orange-800 text-orange-300 shadow-none cursor-not-allowed'
                        : 'bg-white hover:bg-slate-50 text-orange-600 active:scale-95'
                    }`}
                  >
                    {hasClaimedBonusForBook[activeBook.id] ? '✓ ĐÃ NHẬN XP' : 'ĐÃ LĨNH HỘI +20 XP'}
                  </button>
                </div>
              )}

              {/* Core Text content structured realistically */}
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-sm.5 mt-4">
                {/* Manual markdown parsing styled elegantly using Tailwind classes */}
                {activeBook.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('###')) {
                    return (
                      <h3 key={index} className="text-lg font-extrabold text-slate-900 border-l-4 border-l-orange-600 pl-3.5 mt-8 mb-4">
                        {paragraph.replace('###', '').trim()}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('1.') || paragraph.startsWith('-')) {
                    return (
                      <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-100 my-4 pl-4 font-medium text-slate-700 text-xs sm:text-sm">
                        {paragraph}
                      </div>
                    );
                  }
                  return (
                    <p key={index} className="mb-4 leading-relaxed mt-1 whitespace-pre-line font-medium text-sm">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Read Confirmation banner */}
              <div className="pt-8 border-t border-slate-200 text-center flex flex-col items-center gap-3">
                <ShieldCheck className="w-10 h-10 text-orange-600 animate-pulse" />
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest leading-none">Trung thực - Trách nhiệm - Hiệu quả</p>
                <p className="text-xs text-slate-500 max-w-sm">Tài liệu bảo hiểm an toàn thuộc Tổng công ty xây dựng Bách Việt. Mọi hoạt động sao chép hoặc trích phát tán ngoài hệ thống sẽ chịu truy tố kỉ luật.</p>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
              <Compass className="w-12 h-12" />
              <p className="font-bold">Vui lòng chọn tài liệu bạn cần tra cứu ở danh mục bên trái.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
