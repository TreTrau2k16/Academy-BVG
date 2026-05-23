/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, Compass, HardHat, ShieldCheck, ChevronRight, User, Award, CheckCircle, Target, Users, BookOpen } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Role } from '../types';

interface LandingPageProps {
  onStartOnboarding: (name: string, role: Role, goal: 'easy' | 'normal' | 'hard') => void;
  onLoginSuccess: (profile: any, isAdmin: boolean) => void;
  onQuickAccess: () => void;
  dynamicRoles?: any[];
}

export default function LandingPage({ onStartOnboarding, onLoginSuccess, onQuickAccess, dynamicRoles }: LandingPageProps) {
  const [wizardStep, setWizardStep] = useState<number>(0); // 0 = Home, 1 = Choose Role, 2 = Choose Quiz Goal, 3 = Name Input, 4 = Login
  
  const fallbackRoles = [
    {
      id: 'site-engineer' as Role,
      title: 'Kỹ Sư Hiện Trường',
      subtitle: 'Thi công, Giám sát, Bảo dưỡng',
      icon: 'HardHat',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-800',
      description: 'Chuyên trách điều phối thi công thực địa, kiểm soát an toàn giàn giáo, đổ và bảo dưỡng bê tông cốt thép thương phẩm.'
    },
    {
      id: 'architect' as Role,
      title: 'Kiến Trúc Sư / Thiết Kế',
      subtitle: 'BIM, Revit, Bản vẽ Shop',
      icon: 'Compass',
      color: 'from-sky-500 to-sky-600',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-200',
      textColor: 'text-sky-800',
      description: 'Chuyên về mô hình hóa thông tin công trình (BIM), xuất bản vẽ Shop Drawing, thiết kế tối ưu hệ kết cấu cơ điện.'
    },
    {
      id: 'pm-admin' as Role,
      title: 'Quản Lý Dự Án / Văn Phòng',
      subtitle: 'Hợp đồng, RFI, Tiến độ',
      icon: 'Building2',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-800',
      description: 'Quản lý tài liệu dự án, theo dõi tiến độ tổng thể bằng sơ đồ Gantt, đấu thầu cung ứng vật tư và phê duyệt kế toán.'
    }
  ];

  const rolesToRender = (dynamicRoles && dynamicRoles.length > 0) ? dynamicRoles : fallbackRoles;

  const [selectedRole, setSelectedRole] = useState<Role>('site-engineer');

  // React effect to ensure selectedRole is adjusted when custom roles are retrieved
  React.useEffect(() => {
    if (rolesToRender && rolesToRender.length > 0) {
      const exists = rolesToRender.some(r => r.id === selectedRole);
      if (!exists) {
        setSelectedRole(rolesToRender[0].id);
      }
    }
  }, [rolesToRender, selectedRole]);

  const [selectedGoal, setSelectedGoal] = useState<'easy' | 'normal' | 'hard'>('normal');
  const [nameInput, setNameInput] = useState<string>('');
  const [nameError, setNameError] = useState<string>('');

  // Login screen states
  const [loginInput, setLoginInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const handleLoginSubmit = async () => {
    const trimmed = loginInput.trim();
    if (!trimmed) {
      setLoginError('Vui lòng nhập tên đăng nhập!');
      return;
    }

    setLoginError('');
    setIsLoggingIn(true);

    if (trimmed === 'xdbachvietadmin') {
      setIsLoggingIn(false);
      onLoginSuccess(null, true);
      return;
    }

    try {
      const response = await fetch(`/api/profiles/${encodeURIComponent(trimmed)}`);
      if (response.ok) {
        const profile = await response.json();
        setIsLoggingIn(false);
        onLoginSuccess(profile, false);
      } else {
        const errorData = await response.json();
        setLoginError(errorData.error || 'Tên đăng nhập không chính xác hoặc chưa được đăng ký.');
      }
    } catch (err) {
      setLoginError('Không thể kết nối với hệ thống máy chủ. Vui lòng thử lại sau.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleNextStep = () => {
    if (wizardStep === 1) {
      setWizardStep(2);
    } else if (wizardStep === 2) {
      setWizardStep(3);
    } else if (wizardStep === 3) {
      if (!nameInput.trim()) {
        setNameError('Vui lòng nhập họ và tên của bạn để cấp Thẻ Nhân Viên!');
        return;
      }
      setNameError('');
      onStartOnboarding(nameInput.trim(), selectedRole, selectedGoal);
    }
  };

  // Static roles list removed, using config-driven rolesToRender instead

  return (
    <div id="landing-container" className="min-h-screen bg-slate-50 text-slate-800 selection:bg-orange-500 selection:text-white flex flex-col font-sans">
      
      {/* HEADER (Duolingo Style: Sticky, white background, sleek logo and CTA) */}
      <header id="landing-header" className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Custom vector Logo representing a stylish high-contrast crane bird / construction element */}
            <div className="w-11 h-11 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
                <polyline points="7.5 19.79 7.5 14.6 22 6.25" />
                <polyline points="21 10 12 14.81 3 10" strokeWidth="2" strokeDasharray="1 1" />
              </svg>
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">BÁCH VIỆT <span className="text-orange-600">ACADEMY</span></span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">CONSTRUCTION ONBOARDING</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              id="header-shortcut-btn"
              onClick={onQuickAccess}
              className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Xem Tủ Sách Nội Bộ 📘
            </button>
            <button 
              id="header-start-btn" 
              onClick={() => setWizardStep(1)}
              className="hidden sm:block bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md shadow-orange-500/10 cursor-pointer active:scale-95 transition-all"
            >
              Hội Nhập Ngay 🚀
            </button>
          </div>
        </div>
      </header>

      {/* DETAILED CONTENT AREA */}
      <main className="flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {wizardStep === 0 && (
            <motion.div 
              key="hero-step"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-6 py-10 md:py-20 w-full"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* HERO GRAPHIC - Left/Center Column (Duolingo visual equivalent) */}
                <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
                  
                  {/* Floating construction elements & Mascot animation */}
                  <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
                    
                    {/* Glowing backgrounds */}
                    <div className="absolute w-72 h-72 rounded-full bg-orange-100/60 blur-3xl -z-10 animate-pulse" />
                    <div className="absolute w-56 h-56 rounded-full bg-amber-100/50 blur-3xl -z-10 animate-ping" style={{ animationDuration: '6s' }} />

                    {/* Central Skyline Isometric Canvas */}
                    <svg className="w-full h-full drop-shadow-2xl" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                      
                      {/* Grid background lines */}
                      <g stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" opacity="0.4">
                        <line x1="50" y1="200" x2="350" y2="200" />
                        <line x1="200" y1="50" x2="200" y2="350" />
                        <circle cx="200" cy="200" r="120" strokeWidth="0.5" />
                        <circle cx="200" cy="200" r="160" strokeWidth="0.5" />
                      </g>

                      {/* Isometric Building 1 */}
                      <g className="animate-bounce" style={{ animationDuration: '4s' }}>
                        {/* Side Left */}
                        <path d="M120,240 L160,260 L160,140 L120,120 Z" fill="#475569" />
                        {/* Side Right */}
                        <path d="M160,260 L200,240 L200,120 L160,140 Z" fill="#64748b" />
                        {/* Top Roof */}
                        <path d="M120,120 L160,140 L200,120 L160,100 Z" fill="#94a3b8" />
                        {/* Highlights/Windows */}
                        <path d="M130,150 L140,155 L140,165 L130,160 Z" fill="#38bdf8" />
                        <path d="M130,180 L140,185 L140,195 L130,190 Z" fill="#38bdf8" />
                        <path d="M130,210 L140,215 L140,225 L130,220 Z" fill="#38bdf8" />
                        
                        <path d="M180,150 L190,145 L190,155 L180,160 Z" fill="#38bdf8" />
                        <path d="M180,180 L190,175 L190,185 L180,190 Z" fill="#38bdf8" />
                        <path d="M180,210 L190,205 L190,215 L180,220 Z" fill="#38bdf8" />
                      </g>

                      {/* Isometric Building 2 (Under Construction) + Scaffold */}
                      <g className="animate-pulse">
                        {/* Side Left */}
                        <path d="M220,270 L250,285 L250,210 L220,195 Z" fill="#ea580c" />
                        {/* Side Right */}
                        <path d="M250,285 L280,270 L280,195 L250,210 Z" fill="#f97316" />
                        {/* Scaffold grid on top */}
                        <line x1="220" y1="195" x2="250" y2="210" stroke="#f59e0b" strokeWidth="2" />
                        <line x1="250" y1="210" x2="280" y2="195" stroke="#f59e0b" strokeWidth="2" />
                        <line x1="235" y1="202" x2="235" y2="280" stroke="#f59e0b" strokeWidth="1.5" />
                        <line x1="265" y1="202" x2="265" y2="280" stroke="#f59e0b" strokeWidth="1.5" />
                        <line x1="230" y1="170" x2="265" y2="150" stroke="#f59e0b" strokeWidth="2" />
                      </g>

                      {/* Construction Crane Tower (Hạc Tháp) reaching the sky */}
                      <g className="transition-transform duration-1000 transform hover:rotate-6 origin-bottom-left">
                        {/* Crane Mast */}
                        <line x1="100" y1="310" x2="100" y2="100" stroke="#f59e0b" strokeWidth="4" />
                        <line x1="90" y1="312" x2="110" y2="312" stroke="#475569" strokeWidth="3" />
                        {/* Cross lattices */}
                        <line x1="100" y1="250" x2="110" y2="260" stroke="#f59e0b" strokeWidth="1.5" />
                        <line x1="100" y1="200" x2="110" y2="210" stroke="#f59e0b" strokeWidth="1.5" />
                        <line x1="100" y1="150" x2="110" y2="160" stroke="#f59e0b" strokeWidth="1.5" />
                        <line x1="100" y1="100" x2="110" y2="110" stroke="#f59e0b" strokeWidth="1.5" />
                        {/* Crane Arm */}
                        <line x1="40" y1="100" x2="210" y2="100" stroke="#f59e0b" strokeWidth="4.5" />
                        {/* Crane Counterweight */}
                        <rect x="45" y="94" width="16" height="12" rx="2" fill="#ef4444" />
                        {/* Crane Cab */}
                        <rect x="90" y="88" width="18" height="18" rx="3" fill="#1e293b" />
                        <rect x="92" y="91" width="6" height="6" fill="#38bdf8" />
                        {/* Hook details cord */}
                        <line x1="170" y1="102" x2="170" y2="175" stroke="#64748b" strokeWidth="1.5" />
                        {/* Hook */}
                        <path d="M168,175 Q170,183 172,175" stroke="#1e293b" strokeWidth="2" fill="none" />
                        {/* Hanging Steel Block */}
                        <rect x="155" y="180" width="30" height="10" rx="1" fill="#475569" />
                      </g>

                      {/* THE MASCOT: Friendly Hạc Việt (White crane bird with Hardhat and custom smile!) */}
                      <g transform="translate(185, 230)" className="animate-bounce" style={{ animationDuration: '3s' }}>
                        {/* Wings/Body */}
                        <ellipse cx="60" cy="80" rx="36" ry="25" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
                        <path d="M 32 82 C 22 84, 18 78, 25 72" stroke="#e2e8f0" strokeWidth="2.5" fill="none" />
                        {/* Long Neck of Crane */}
                        <path d="M 85 70 C 95 55, 95 38, 90 25" stroke="#f8fafc" strokeWidth="9" strokeLinecap="round" fill="none" />
                        {/* Crane Head */}
                        <circle cx="89" cy="20" r="14" fill="#f8fafc" />
                        <circle cx="94" cy="18" r="2" fill="#0f172a" /> {/* Eye */}
                        {/* Sharp yellow beak */}
                        <polygon points="102,17 116,21 102,26" fill="#f59e0b" />
                        
                        {/* Orange legs standing gracefully */}
                        <line x1="50" y1="104" x2="50" y2="135" stroke="#f97316" strokeWidth="3" />
                        <line x1="70" y1="104" x2="70" y2="135" stroke="#f97316" strokeWidth="3" />
                        <line x1="50" y1="135" x2="44" y2="138" stroke="#f97316" strokeWidth="3" />
                        <line x1="70" y1="135" x2="64" y2="138" stroke="#f97316" strokeWidth="3" />

                        {/* HIGH-RES STYLISH YELLOW HARDHAT */}
                        <path d="M72,12 Q90,-2 104,12 Z" fill="#eab308" />
                        <rect x="68" y="10" width="39" height="3" rx="1" fill="#ca8a04" />
                        {/* Safety Vest (Neon Orange/Green stripes) */}
                        <path d="M 40 85 C 40 98, 79 98, 80 85" fill="#f97316" />
                        <line x1="48" y1="85" x2="48" y2="95" stroke="#22c55e" strokeWidth="3" />
                        <line x1="72" y1="85" x2="72" y2="95" stroke="#22c55e" strokeWidth="3" />
                      </g>

                      {/* Small cloud elements */}
                      <path d="M30,80 Q45,70 60,80 Q75,70 90,80 L90,95 L30,95 Z" fill="#ffffff" opacity="0.8" />
                      <path d="M310,110 Q325,100 340,110 Q355,100 370,110 L370,125 L310,125 Z" fill="#ffffff" opacity="0.8" />
                    </svg>

                    {/* Speech bubble from Mascot "Hạc Việt" */}
                    <div className="absolute top-1/4 -right-12 sm:right-0 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 max-w-[190px]">
                      <span className="absolute left-[-8px] top-6 w-3 h-3 bg-white border-l border-b border-slate-100 rotate-45" />
                      <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                        Chào đồng nghiệp mới! Chào mừng tới <strong className="text-orange-600">Bách Việt</strong>. Let's build! 👷‍♂️📐
                      </p>
                    </div>
                  </div>
                </div>

                {/* SLOGAN & ACTIONS - Right Column */}
                <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-3.5 py-1.5 self-center lg:self-start mb-6">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                    </span>
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Hội nhập thông minh 4.0</span>
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-none">
                    Một ý chí, <br className="hidden md:inline" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">một niềm tin!</span>
                  </h1>

                  <p className="mt-6 text-base md:text-lg text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                    Học tập văn hóa doanh nghiệp, quy chuẩn An toàn Lao động HSE và Quy trình xây dựng thực tế theo phong cách gamified trực quan sinh động.
                  </p>

                  {/* DUOLINGO 3D ACTION BUTTONS */}
                  <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start max-w-md mx-auto lg:mx-0">
                    <button
                      id="hero-get-started-btn"
                      onClick={() => setWizardStep(1)}
                      className="w-full sm:w-auto px-10 py-5 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-lg uppercase tracking-wider rounded-2xl cursor-pointer shadow-[0_4px_0_#ea580c] active:translate-y-1 active:shadow-none hover:-translate-y-[1px] transition-all flex items-center justify-center gap-3"
                    >
                      Bắt đầu ngay
                      <ChevronRight className="w-5 h-5 stroke-[3]" />
                    </button>
                    
                    <button
                      id="hero-quick-access-btn"
                      onClick={() => setWizardStep(4)}
                      className="w-full sm:w-auto px-10 py-5 bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-lg uppercase tracking-wider rounded-2xl cursor-pointer border-2 border-slate-200 shadow-[0_4px_0_#cbd5e1] active:translate-y-1 active:shadow-none hover:-translate-y-[1px] transition-all flex items-center justify-center cursor-pointer"
                    >
                      Tôi đã có tài khoản
                    </button>
                  </div>

                  {/* Stats bar */}
                  <div className="mt-12 pt-8 border-t border-slate-200/60 grid grid-cols-3 gap-4">
                    <div>
                      <span className="block text-2xl md:text-3xl font-black text-slate-900">500+</span>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">Cán bộ tham gia</span>
                    </div>
                    <div>
                      <span className="block text-2xl md:text-3xl font-black text-slate-900">100%</span>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">An toàn lao động</span>
                    </div>
                    <div>
                      <span className="block text-2xl md:text-3xl font-black text-slate-900">20+</span>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">Công trình quốc gia</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* WHY US - Elegant Grid Section */}
              <div className="mt-24 pt-16 border-t border-slate-200/60">
                <h2 className="text-center font-black text-2xl md:text-3xl text-slate-900 tracking-tight">
                  Nền Tảng Có Gì Đặc Biệt Hơn Đào Tạo Truyền Thống?
                </h2>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                      <Award className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-lg">Phương pháp Gamified</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Sát hạch kiến thức sinh động thông qua điểm thưởng XP, thăng hạng chuỗi ngày học liên tục và nhận thưởng Chứng Chỉ điện tử chất lượng thực tế.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                      <ShieldCheck className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-lg">An Toàn Kỹ Nghệ Sát Bản</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Các tiêu chuẩn an toàn HSE công trường được mô phỏng bằng kịch bản thật từ việc thắt đai an toàn trên giàn giáo đến dập nguồn rò rỉ điện.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                      <BookOpen className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-lg">Môn Học Chuyên Sâu</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Nội dung bài học tự động phân nhánh theo vai trò: Kỹ sư xây dựng hiện trường, Kiến trúc sư thiết kế mô hình BIM hay Quản lý dự án.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Users className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h3 className="font-extrabold text-slate-800 text-lg">Nhận Chứng Chỉ Đội Ngũ</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Kiểm nghiệm đạt kết quả xuất sắc sẽ được trao Chứng Chỉ Hội Nhập điện tử ký bởi Hội đồng Quản trị để lưu trữ trực tiếp vào hồ sơ thử việc.
                    </p>
                  </div>

                </div>
              </div>
            </motion.div>
          )}

          {/* WIZARD STEP 1: CHOOSE ROLE */}
          {wizardStep === 1 && (
            <motion.div 
              key="wizard-step-1"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto px-6 py-12 w-full text-center"
            >
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Vị trí công tác của bạn tại Bách Việt là gì?
              </h2>
              <p className="mt-3 text-slate-500 font-medium">
                Chúng tôi sẽ tối ưu hóa giáo trình và các bài kiểm tra thực tế riêng biệt cho vị trí của bạn.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-4 text-left max-w-2xl mx-auto">
                {rolesToRender.map((item) => {
                  const IconComp = (LucideIcons as any)[item.icon] || LucideIcons.HardHat;
                  const isSelected = selectedRole === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedRole(item.id)}
                      className={`p-6 rounded-2xl border-2 transition-all cursor-pointer text-left flex gap-5 items-start ${
                        isSelected 
                          ? 'border-orange-600 bg-orange-50/50 shadow-md ring-2 ring-orange-500/15' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color || 'from-amber-500 to-amber-600'} text-white shrink-0`}>
                        <IconComp className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-slate-900 text-lg">{item.title}</h3>
                          {isSelected && (
                            <span className="bg-orange-600 text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold">
                              Đang Chọn
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{item.subtitle}</p>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">{item.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-12 flex justify-between items-center max-w-2xl mx-auto">
                <button
                  onClick={() => setWizardStep(0)}
                  className="px-6 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-10 py-4 bg-orange-600 hover:bg-orange-500 text-white font-extrabold tracking-wider rounded-xl cursor-pointer shadow-[0_4px_0_#ea580c] active:translate-y-1 active:shadow-none hover:-translate-y-[1px] transition-all"
                >
                  TIẾP TỤC
                </button>
              </div>
            </motion.div>
          )}

          {/* WIZARD STEP 2: CHOOSE GOAL */}
          {wizardStep === 2 && (
            <motion.div 
              key="wizard-step-2"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto px-6 py-12 w-full text-center"
            >
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Mục tiêu của bạn là gì?
              </h2>
              <p className="mt-3 text-slate-500 font-medium">
                Chọn cường độ học tập và kiểm tra định kỳ hàng ngày phù hợp với lịch làm việc.
              </p>

              <div className="mt-10 flex flex-col gap-4 text-left max-w-lg mx-auto">
                {[
                  { id: 'easy' as const, label: 'Học thong thả 🎈', desc: '5 phút / ngày', sub: 'Phù hợp làm quen văn hóa cơ bản' },
                  { id: 'normal' as const, label: 'Học tập trung ⚡', desc: '10 phút / ngày', sub: 'Mức chuyên biệt được đề xuất' },
                  { id: 'hard' as const, label: 'Siêu tốc chiến binh 🔥', desc: '20 phút / ngày', sub: 'Hoàn thành cấp tốc giai đoạn thử việc' }
                ].map((g) => {
                  const isSel = selectedGoal === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGoal(g.id)}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center ${
                        isSel 
                          ? 'border-orange-600 bg-orange-50/50 shadow-md ring-2 ring-orange-500/15' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">{g.label}</h4>
                        <p className="text-xs text-slate-400 font-bold tracking-wide mt-0.5">{g.sub}</p>
                      </div>
                      <span className={`text-sm font-extrabold px-3 py-1.5 rounded-xl ${isSel ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {g.desc}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-12 flex justify-between items-center max-w-lg mx-auto">
                <button
                  onClick={() => setWizardStep(1)}
                  className="px-6 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-10 py-4 bg-orange-600 hover:bg-orange-500 text-white font-extrabold tracking-wider rounded-xl cursor-pointer shadow-[0_4px_0_#ea580c] active:translate-y-1 active:shadow-none hover:-translate-y-[1px] transition-all"
                >
                  TIẾP TỤC
                </button>
              </div>
            </motion.div>
          )}

          {/* WIZARD STEP 3: INPUT NAME */}
          {wizardStep === 3 && (
            <motion.div 
              key="wizard-step-3"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto px-6 py-12 w-full text-center"
            >
              <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10" />
              </div>

              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Họ và Tên của bạn là gì?
              </h2>
              <p className="mt-3 text-slate-500 font-medium">
                Tên này sẽ hiển thị trên Thẻ Nhân Viên, Bảng xếp hạng thi đua và Chứng chỉ hoàn thành Bách Việt Academy.
              </p>

              <div className="mt-8 text-left">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Họ & Tên Nhân Sự Mới</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => {
                    setNameInput(e.target.value);
                    if (e.target.value.trim()) setNameError('');
                  }}
                  placeholder="Ví dụ: Nguyễn Văn Trỗi"
                  className="w-full bg-white border-2 border-slate-200 focus:border-orange-600 outline-none px-5 py-4 rounded-2xl text-slate-800 text-lg font-bold transition-all shadow-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleNextStep();
                  }}
                  autoFocus
                />
                {nameError && (
                  <p className="text-red-500 text-sm font-bold mt-2 flex items-center gap-1.5 justify-center">
                    ⚠️ {nameError}
                  </p>
                )}
              </div>

              <div className="mt-12 flex justify-between items-center">
                <button
                  onClick={() => setWizardStep(2)}
                  className="px-6 py-3 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all cursor-pointer active:scale-95"
                >
                  Quay lại
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-12 py-4 bg-orange-600 hover:bg-orange-500 text-white font-extrabold tracking-wider rounded-xl cursor-pointer shadow-[0_4px_0_#ea580c] active:translate-y-1 active:shadow-none hover:-translate-y-[1px] transition-all"
                >
                  HOÀN TẤT THIẾT LẬP 🎉
                </button>
              </div>
            </motion.div>
          )}

          {/* WIZARD STEP 4: LOGIN PAGE */}
          {wizardStep === 4 && (
            <motion.div 
              key="wizard-step-4"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto px-6 py-12 w-full text-center animate-fade"
            >
              <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-10 h-10" />
              </div>

              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Đăng Nhập Khảo Sát
              </h2>
              <p className="mt-3 text-slate-500 font-medium text-xs sm:text-sm leading-relaxed">
                Nhập đúng tên đăng nhập thành viên để tiếp tục lộ trình học tập, hoặc tài khoản quản lý hành chính để bắt đầu.
              </p>

              <div className="mt-8 text-left">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Tên Đăng Nhập Hệ Thống</label>
                <input
                  type="text"
                  value={loginInput}
                  onChange={(e) => {
                    setLoginInput(e.target.value);
                    if (e.target.value.trim()) setLoginError('');
                  }}
                  placeholder="Học viên (ví dụ: Lê Thanh Vân) hoặc admin"
                  className="w-full bg-white border-2 border-slate-200 focus:border-orange-600 outline-none px-5 py-4 rounded-2xl text-slate-800 text-base font-bold transition-all shadow-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLoginSubmit();
                  }}
                  autoFocus
                />
                
                {loginError && (
                  <p className="text-red-500 text-xs sm:text-sm font-bold mt-3 text-center">
                    ⚠️ {loginError}
                  </p>
                )}
                
                <p className="mt-4 text-[10px] text-slate-400 leading-normal font-semibold text-center italic">
                  * Tài khoản Admin phục vụ khảo sát tiến độ: <strong className="text-orange-600 font-black">xdbachvietadmin</strong>
                </p>
              </div>

              <div className="mt-10 flex gap-4 items-center justify-between">
                <button
                  onClick={() => setWizardStep(0)}
                  className="flex-1 py-4 border-2 border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all cursor-pointer active:scale-95 text-sm uppercase tracking-wider"
                >
                  HỦY BỎ
                </button>
                <button
                  onClick={handleLoginSubmit}
                  disabled={isLoggingIn}
                  className={`flex-1 py-4 text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl cursor-pointer shadow-[0_4px_0_#ea580c] active:translate-y-1 active:shadow-none hover:-translate-y-[1px] transition-all flex items-center justify-center gap-1.5 ${
                    isLoggingIn ? 'bg-orange-450 cursor-not-allowed opacity-80' : 'bg-orange-600 hover:bg-orange-500'
                  }`}
                >
                  {isLoggingIn ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP 🔑'}
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>



    </div>
  );
}
