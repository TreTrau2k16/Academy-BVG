/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, Heart, Trophy, ChevronRight, Compass, ShieldAlert, Award, 
  BookOpen, Users, LogOut, Check, Lock, Play, RotateCcw, Building, MapPin, 
  HardHat, HelpCircle, FileText, ChevronLeft, ArrowRight
} from 'lucide-react';
import { LessonNode, UserProfile, LeaderboardUser, Role } from '../types';

interface DashboardProps {
  user: UserProfile;
  lessons: LessonNode[];
  onStartLesson: (lessonId: number) => void;
  onResetProgress: () => void;
  onLogout: () => void;
  onViewHandbook: () => void;
  onViewCertificate: () => void;
  onAdminAccess?: () => void;
  isAdmin?: boolean;
  xpBonusReadingHandbook?: number;
  onUpdateProfile?: (profile: UserProfile) => void;
  dynamicRoles?: any[];
}

export default function Dashboard({
  user,
  lessons,
  onStartLesson,
  onResetProgress,
  onLogout,
  onViewHandbook,
  onViewCertificate,
  onAdminAccess,
  isAdmin,
  xpBonusReadingHandbook,
  onUpdateProfile,
  dynamicRoles
}: DashboardProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<number | null>(null);

  // Mock Leaderboard users containing user dynamically
  const leaderboardData: LeaderboardUser[] = [
    { name: "Phạm Minh Hoàng (Site Team)", role: 'site-engineer' as Role, xp: 580, streak: 8, avatarSeed: 1 },
    { name: "Lê Thanh Vân (BIM Lead)", role: 'architect' as Role, xp: 450, streak: 5, avatarSeed: 2 },
    { name: user.name + " (Tôi)", role: user.role, xp: user.xp, streak: user.streak, isSelf: true, avatarSeed: 3 },
    { name: "Trương Quốc Khánh (PM)", role: 'pm-admin' as Role, xp: 320, streak: 3, avatarSeed: 4 },
    { name: "Nguyễn Thùy Linh (BOD Support)", role: 'pm-admin' as Role, xp: 190, streak: 2, avatarSeed: 5 },
  ].sort((a, b) => b.xp - a.xp);

  // Map category to color scheme
  const getCategoryTheme = (category: string) => {
    switch(category) {
      case 'culture': return { bg: 'bg-indigo-500', hoverBg: 'hover:bg-indigo-600', ringColor: 'ring-indigo-100', text: 'text-indigo-600', fill: '#6366f1' };
      case 'safety': return { bg: 'bg-rose-500', hoverBg: 'hover:bg-rose-600', ringColor: 'ring-rose-100', text: 'text-rose-600', fill: '#f43f5e' };
      case 'technical': return { bg: 'bg-amber-500', hoverBg: 'hover:bg-amber-600', ringColor: 'ring-amber-100', text: 'text-amber-600', fill: '#f59e0b' };
      case 'materials': return { bg: 'bg-sky-500', hoverBg: 'hover:bg-sky-600', ringColor: 'ring-sky-100', text: 'text-sky-600', fill: '#0ea5e9' };
      default: return { bg: 'bg-emerald-500', hoverBg: 'hover:bg-emerald-600', ringColor: 'ring-emerald-100', text: 'text-emerald-600', fill: '#10b981' };
    }
  };

  const currentActiveLessonId = lessons.find(
    (l) => !user.completedLessons.includes(l.id)
  )?.id || lessons[lessons.length - 1].id;

  const isAllLessonsCompleted = lessons.every((l) => user.completedLessons.includes(l.id));

  // Duolingo offset coordinates to create circular path effect
  const offsets = [
    "translate-x-0",
    "translate-x-12 sm:translate-x-16",
    "-translate-x-12 sm:-translate-x-16",
    "translate-x-8 sm:translate-x-12",
    "translate-x-0",
  ];

  const getRoleBadgeViet = (r: string) => {
    if (dynamicRoles && dynamicRoles.length > 0) {
      const match = dynamicRoles.find(dr => dr.id === r);
      if (match) return match.title;
    }
    switch (r) {
      case 'site-engineer': return 'Kỹ Sư Hiện Trường 👷';
      case 'architect': return 'Kiến Trúc Sư 📐';
      default: return 'Quản Lý Dự Án 💼';
    }
  };

  return (
    <div id="dashboard-layout" className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      
      {/* 1. DUOLINGO LEFT NAVIGATION BAR */}
      <aside id="side-nav-bar" className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-4 md:p-6 flex flex-row md:flex-col gap-4 justify-between md:justify-start md:sticky md:top-0 md:h-screen shrink-0 z-30">
        <div className="flex flex-col gap-8 w-full">
          {/* Back to top or home */}
          <div className="hidden md:flex items-center gap-2.5 px-2">
            <div className="w-9 h-9 bg-orange-600 rounded-lg flex items-center justify-center text-white">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-slate-900 tracking-wide uppercase">Bách Việt Admin</span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Internal Academy</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-row md:flex-col w-full gap-2 overflow-x-auto md:overflow-x-visible pb-1 md:pb-0">
            <button 
              onClick={() => setSelectedNodeId(null)}
              className="flex items-center gap-3 w-full px-4 py-3 bg-orange-50 text-orange-700 font-extrabold text-sm rounded-xl border border-orange-100 whitespace-nowrap cursor-pointer transition-all"
            >
              <Compass className="w-5 h-5 shrink-0" />
              <span>Bản Đồ Học</span>
            </button>
            <button 
              onClick={onViewHandbook}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-slate-50 text-slate-500 hover:text-slate-800 font-bold text-sm rounded-xl border border-transparent hover:border-slate-100 whitespace-nowrap cursor-pointer transition-all"
            >
              <BookOpen className="w-5 h-5 shrink-0" />
              <span>Sách Cẩm Nang</span>
            </button>
            <button 
              onClick={onViewCertificate}
              className={`flex items-center gap-3 w-full px-4 py-3 font-bold text-sm rounded-xl border transition-all whitespace-nowrap cursor-pointer ${
                isAllLessonsCompleted 
                  ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600 border-transparent'
              }`}
            >
              <Award className="w-5 h-5 shrink-0" />
              <span>Chứng Chỉ {isAllLessonsCompleted && '🔥'}</span>
            </button>
          </nav>
        </div>

        {/* User Quick Info & Action in Sidebar Footer */}
        <div className="hidden md:flex flex-col gap-4 mt-auto pt-6 border-t border-slate-100 w-full">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100/80 border border-orange-200 flex items-center justify-center text-orange-800 font-black text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-extrabold text-xs text-slate-800 leading-tight truncate max-w-[130px]">{user.name}</p>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide leading-none">{getRoleBadgeViet(user.role).split(' ')[0]} {getRoleBadgeViet(user.role).split(' ')[1]}</span>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2.5 text-xs font-bold text-red-500 hover:text-red-700 transition-colors p-2 cursor-pointer w-fit self-start"
          >
            <LogOut className="w-4 h-4" />
            <span>Thoát Tài Khoản</span>
          </button>
        </div>
      </aside>

      {/* 2. CHÍNH: MAP PATHWAY (DUOLINGO MAP) */}
      <section id="pathway-section" className="flex-1 max-w-xl mx-auto px-6 py-8 flex flex-col items-center">
        
        {/* Welcome Section Header Banner */}
        <div className="w-full bg-gradient-to-br from-orange-600 to-amber-800 rounded-3xl p-6 text-white mb-10 shadow-lg shadow-amber-800/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-4 -translate-y-4 pointer-events-none" />
          <p className="text-xs font-bold text-orange-200 uppercase tracking-wider">Học Viện Đào Tạo Bách Việt</p>
          <h2 className="text-xl sm:text-2xl font-black mt-1">Lộ Trình Hội Nhập Của Bạn</h2>
          <p className="text-xs text-slate-200 mt-2 leading-relaxed">
            Hoàn tất các cột mốc thi đua dưới đây dưới dạng trò chơi đố vui để mở khóa Chứng Chỉ Hội Nhập của Phòng Nhân Sự!
          </p>
          
          <div className="mt-4 flex items-center justify-between bg-white/10 rounded-2xl p-3 backdrop-blur-sm border border-white/5">
            <div className="flex items-center gap-2">
              <HardHat className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold">Chức vụ: <span className="text-amber-300">{getRoleBadgeViet(user.role)}</span></span>
            </div>
            <span className="text-xs font-extrabold bg-orange-500 px-2.5 py-1 rounded-full">{user.xp} XP</span>
          </div>
        </div>

        {/* Vertical learning road path */}
        <div className="relative flex flex-col items-center py-6 w-full gap-12 select-none">
          
          {/* Vertical Connecting Curved SVG Path lines */}
          <div className="absolute top-10 bottom-10 w-1 bg-slate-200 -z-10" />

          {lessons.map((lesson, index) => {
            const isCompleted = user.completedLessons.includes(lesson.id);
            const isActive = lesson.id === currentActiveLessonId && !isCompleted;
            const isLocked = lesson.id > currentActiveLessonId && !isCompleted;
            
            const theme = getCategoryTheme(lesson.category);
            const offsetClass = offsets[index % offsets.length];

            return (
              <div 
                key={lesson.id} 
                className={`relative flex flex-col items-center ${offsetClass} transition-all duration-300`}
              >
                
                {/* Visual Label Above Active Node */}
                {isActive && (
                  <motion.div 
                    initial={{ y: -5, opacity: 0 }}
                    animate={{ y: [0, -6, 0], opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                    className="absolute -top-12 bg-orange-600 text-white font-extrabold text-[11px] px-3.5 py-1.5 rounded-xl shadow-md border border-orange-500 whitespace-nowrap z-20 uppercase tracking-widest"
                  >
                    Học tiếp ⚡
                    <span className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-orange-600 border-r border-b border-orange-500 rotate-45" />
                  </motion.div>
                )}

                {/* LESSON NODE BUTTON (Duolingo Round Button) */}
                <button
                  id={`lesson-node-${lesson.id}`}
                  onClick={() => setSelectedNodeId(selectedNodeId === lesson.id ? null : lesson.id)}
                  className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full cursor-pointer relative flex items-center justify-center border-b-6 transition-all ring-8 duration-200 ${
                    isCompleted 
                      ? 'bg-amber-400 border-amber-600 ring-amber-100 hover:bg-amber-300 hover:border-amber-500 text-amber-950 shadow-md' 
                      : isActive 
                        ? `${theme.bg} ${theme.hoverBg} border-teal-800 ring-teal-100 text-white shadow-xl animate-pulse scale-105` 
                        : 'bg-slate-300 border-slate-400 ring-slate-100 text-slate-500 pointer-events-none'
                  }`}
                  style={{
                    transform: selectedNodeId === lesson.id ? 'translateY(2px) scale(0.97)' : '',
                    borderBottomWidth: selectedNodeId === lesson.id ? '2px' : '6px'
                  }}
                >
                  {isCompleted ? (
                    <Award className="w-9 h-9 stroke-[2.5]" />
                  ) : isLocked ? (
                    <Lock className="w-7 h-7 stroke-[2.5]" />
                  ) : (
                    <Play className="w-8 h-8 fill-current ml-1 stroke-[2.5]" />
                  )}
                  
                  {/* Floating level badge number */}
                  <span className="absolute -bottom-1 -right-1 bg-slate-900/90 text-white px-2 py-0.5 rounded-md text-[10px] font-black tracking-wide border border-slate-700 leading-none">
                    MĐ {lesson.id}
                  </span>
                </button>

                {/* Lesson title tooltip */}
                <div className="mt-3 text-center pointer-events-none max-w-[140px] sm:max-w-[170px]">
                  <h4 className={`text-xs font-black leading-tight ${isLocked ? 'text-slate-400' : 'text-slate-800'}`}>
                    {lesson.title}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-wider">
                    {lesson.category === 'culture' ? 'Văn Hoá 🏛️' : lesson.category === 'safety' ? 'An Toàn 🛡️' : ' Nghiệp Vụ 🏗️'}
                  </p>
                </div>

                {/* POPOUT DETAILS CARD (Duolingo Lesson Selector Pane) - Elegant anim overlay */}
                <AnimatePresence>
                  {selectedNodeId === lesson.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className="absolute top-24 left-1/2 -translate-x-1/2 bg-white rounded-2xl p-5 border border-slate-100 shadow-2xl w-[280px] sm:w-[320px] text-center z-40"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider ${
                          isCompleted ? 'bg-amber-100 text-amber-800' : `${theme.text} bg-slate-50 border border-slate-100`
                        }`}>
                          {isCompleted ? 'Hoàn thành Excellent ⭐' : `Chưa hoàn tất (${lesson.questions.length} Câu Đố)`}
                        </span>
                        <HelpCircle className="w-4.5 h-4.5 text-slate-400 cursor-pointer hover:text-slate-600" onClick={onViewHandbook} />
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-lg leading-snug">{lesson.title}</h3>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">{lesson.description}</p>
                      
                      <div className="mt-4 pt-3.5 border-t border-slate-100 flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-400">Thưởng Kính Nghiệm:</span>
                        <span className="font-black text-amber-600 flex items-center gap-1">⚡ +{lesson.xpReward} XP</span>
                      </div>

                      <div className="mt-5 flex gap-2">
                        <button
                          onClick={() => onStartLesson(lesson.id)}
                          className={`flex-1 py-3 font-extrabold text-sm uppercase rounded-xl cursor-pointer text-white flex items-center justify-center gap-1.5 shadow-md active:translate-y-0.5 max-w-[280px] mx-auto ${
                            isCompleted 
                              ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/10' 
                              : 'bg-teal-600 hover:bg-teal-500 shadow-teal-600/10'
                          }`}
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>{isCompleted ? 'HỌC LẠI' : 'BẮT ĐẦU CHƠI'}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            );
          })}

          {/* Locked Badge indicating final placement */}
          <div className="pt-8 flex flex-col items-center">
            <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center shadow-lg ${
              isAllLessonsCompleted ? 'bg-amber-100 border-amber-300 text-amber-600 animate-pulse' : 'bg-slate-100 border-slate-200 text-slate-400'
            }`}>
              <Award className="w-7 h-7" />
            </div>
            <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest mt-2">Bách Việt Ironman</p>
          </div>

        </div>

      </section>

      {/* 3. PHẢI: LADDERS & STATS PANEL (DUOLINGO RIGHT WIDGETS) */}
      <aside id="statistics-sidebar" className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-l border-slate-200 p-6 flex flex-col gap-6 md:sticky md:top-0 md:h-screen shrink-0 overflow-y-auto">
        
        {/* STATS CHICKLETS (Streak, Progress, XP) */}
        <div id="stats-header-bar" className="grid grid-cols-3 gap-2.5 pb-5 border-b border-slate-100">
          
          {/* Flame streak */}
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-2.5 text-center flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-orange-600">
              <Flame className="w-5 h-5 fill-current" />
              <span className="font-black text-base">{user.streak}</span>
            </div>
            <p className="text-[9px] font-extrabold text-orange-700/65 uppercase tracking-wide mt-1">Ngày liên tục</p>
          </div>

          {/* Progress */}
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-2.5 text-center flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-rose-500">
              <BookOpen className="w-5 h-5" />
              <span className="font-black text-base">{user.completedLessons.length}/{lessons.length}</span>
            </div>
            <p className="text-[9px] font-extrabold text-rose-700/65 uppercase tracking-wide mt-1">Bài đã học</p>
          </div>

          {/* Gold medals */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-2.5 text-center flex flex-col items-center justify-center">
            <div className="flex items-center gap-1 text-amber-600">
              <Trophy className="w-5 h-5 fill-current" />
              <span className="font-black text-base">{user.xp}</span>
            </div>
            <p className="text-[9px] font-extrabold text-amber-700/65 uppercase tracking-wide mt-1">Điểm XP</p>
          </div>

        </div>

        {/* MOTIVATION BOX / MASCOT POPUP */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 relative">
          <div className="flex gap-3">
            {/* Hardhat Bird Head vector */}
            <div className="w-12 h-12 bg-orange-600/10 border border-orange-600/10 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-8 h-8" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="#ffffff" />
                <path d="M 30,50 Q 50,20 70,50" stroke="#f59e0b" strokeWidth="6" fill="#eab308" />
                <circle cx="42" cy="58" r="4" fill="#0f172a" />
                <polygon points="56,58 70,62 56,66" fill="#f97316" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-black text-slate-800">Cố lên đồng đội!</p>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                {isAllLessonsCompleted 
                  ? 'Bạn đã làm rất xuất sắc! Hãy nhấn chứng chỉ ở bên trái để tải Bản danh dự!' 
                  : 'Hãy vượt qua bài kiểm tra HSE công trường để mở khóa nghiệp vụ đặc chủng tiếp theo.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* LEADERBOARD (Bảng vàng thi đua - Duolingo rankings) */}
        <div className="flex-1 flex flex-col min-h-[180px]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <Trophy className="w-4.5 h-4.5 text-amber-500 fill-amber-100" />
              Bảng Vàng Nhân Sự Mới
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thời gian thực</span>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            {leaderboardData.map((lbUser, idx) => {
              const rankColors = ["bg-amber-100 text-amber-800 border-amber-200", "bg-slate-100 text-slate-600 border-slate-200", "bg-orange-50 text-orange-800 border-orange-100"];
              return (
                <div 
                  key={lbUser.name}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                    lbUser.isSelf 
                      ? 'bg-orange-50/70 border-orange-200 ring-2 ring-orange-500/5' 
                      : 'bg-white border-slate-100'
                  }`}
                >
                  {/* Rank circle */}
                  <span className={`w-6 h-6 rounded-full text-xs font-black flex items-center justify-center border shrink-0 ${
                    idx < 3 ? rankColors[idx] : 'bg-slate-50 text-slate-400 border-slate-100'
                  }`}>
                    {idx + 1}
                  </span>

                  {/* Name representation */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-extrabold truncate ${lbUser.isSelf ? 'text-orange-950' : 'text-slate-800'}`}>
                      {lbUser.name}
                    </p>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
                      {getRoleBadgeViet(lbUser.role).split(' ')[0]} &bull; 🔥 {lbUser.streak} ngày
                    </span>
                  </div>

                  {/* XP */}
                  <span className="text-xs font-black text-slate-500 shrink-0">
                    {lbUser.xp} XP
                  </span>

                </div>
              );
            })}
          </div>
        </div>

        {/* ADMIN CONTROLS IN THE BOTTOM ROW FOR TRIAL/PLAYGROUND */}
        <div className="pt-4 border-t border-slate-100 mt-auto flex flex-col gap-2">
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Thử Nghiệm Hệ Thống</span>
            <RotateCcw className="w-3.5 h-3.5 cursor-pointer hover:text-slate-600" onClick={onResetProgress} />
          </div>
          <button
            onClick={onResetProgress}
            className="w-full text-center py-2 border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Reset Lộ Trình Từ Đầu ↩️
          </button>
        </div>

      </aside>

    </div>
  );
}
