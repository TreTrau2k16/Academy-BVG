/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Award, ShieldAlert, Download, Printer, ArrowLeft, RefreshCw } from 'lucide-react';
import { UserProfile } from '../types';

interface CertificateProps {
  user: UserProfile;
  onClose: () => void;
  onResetProgress: () => void;
  dynamicRoles?: any[];
}

export default function Certificate({ user, onClose, onResetProgress, dynamicRoles }: CertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const getRoleTitle = (r: string) => {
    if (dynamicRoles && dynamicRoles.length > 0) {
      const match = dynamicRoles.find(dr => dr.id === r);
      if (match) return match.title;
    }
    switch (r) {
      case 'site-engineer': return 'Kỹ Sư Hiện Trường Cấp Cao';
      case 'architect': return 'Kỹ Sư Thiết Kế BIM / Revit';
      default: return 'Quản Lý Dự Án Xây Dựng';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const todayStr = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div id="certificate-page" className="min-h-screen bg-slate-100 flex flex-col items-center justify-center py-12 px-6 print:bg-white print:p-0">
      
      {/* Back bar (hidden in print) */}
      <div className="max-w-4xl w-full flex justify-between items-center mb-6 print:hidden">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-sm cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Về Bản Đồ Học</span>
        </button>

        <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md cursor-pointer transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>In Bản Danh Dự 🖨️</span>
          </button>
        </div>
      </div>

      {/* CORE CERTIFICATE FRAME (Double borders, golden accents, watermarked logo) */}
      <motion.div 
        ref={certificateRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl w-full bg-white border-[16px] border-slate-900/90 rounded-none shadow-2xl relative overflow-hidden aspect-[4/3] p-10 md:p-14 flex flex-col justify-between select-none print:border-[8px] print:shadow-none"
      >
        {/* Golden Inner Thin Border Line */}
        <div className="absolute inset-4 border border-yellow-600/60 pointer-events-none" />
        <div className="absolute inset-5 border-4 border-double border-yellow-600/35 pointer-events-none" />

        {/* Vintage backgrounds corner decorations */}
        <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-yellow-600/80" />
        <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-yellow-600/80" />
        <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-yellow-600/80" />
        <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-yellow-600/80" />

        {/* Giant Watermarked Logo in center bg */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <svg className="w-[380px] h-[380px]" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 15 L20 32 L20 68 L50 85 L80 68 L80 32 Z" />
          </svg>
        </div>

        {/* TOP COPORATE BANNER */}
        <div className="text-center shrink-0">
          <p className="text-[11px] font-black tracking-[0.25em] text-slate-500 uppercase leading-none">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Độc lập - Tự do - Hạnh phúc</p>
          <div className="w-24 h-[1px] bg-slate-300 mx-auto mt-2" />
          
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-7 h-7 bg-teal-600 rounded-md flex items-center justify-center text-white text-xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
                <polyline points="7.5 19.79 7.5 14.6 22 6.25" />
              </svg>
            </div>
            <span className="font-extrabold text-xs tracking-widest text-slate-800 uppercase">TỔNG CÔNG TY CỔ PHẦN XÂY DỰNG BÁCH VIỆT</span>
          </div>
        </div>

        {/* CENTER CONTENT */}
        <div className="text-center my-auto flex flex-col justify-center">
          
          <span className="font-extrabold text-amber-600 text-sm md:text-base tracking-[0.3em] uppercase leading-none block">CHỨNG CHỈ HỘI NHẬP</span>
          
          <h1 className="font-serif font-black text-3xl md:text-4xl text-slate-900 tracking-tight mt-3 block print:text-2xl">
            BÁCH VIỆT ACADEMY
          </h1>

          <p className="text-xs text-slate-400 italic font-medium mt-6">Hội đồng đào tạo và Ban Nhân sự trân trọng vinh danh</p>
          
          {/* User Name */}
          <h2 className="font-serif font-black text-2xl md:text-3xl text-teal-800 tracking-wide underline decoration-yellow-600/40 decoration-wavy underline-offset-8 my-5 block">
            {user.name.toUpperCase()}
          </h2>

          <p className="text-xs md:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Đã xuất sắc vượt qua đợt sát hạch chất lượng đào tạo trực tuyến dành cho nhân sự mới, hoàn thành xuất sắc các nội dung về **Văn hóa Bách Việt**, điều lệ an toàn công trình **HSE Standards**, ứng dụng công nghệ **BIM / Revit** cấu kiện và quy trình liên kết nghiệp vụ phòng ban.
          </p>

          <p className="text-xs text-slate-400 font-bold mt-4">
            Định hướng chức vụ bổ nhiệm: <span className="text-slate-800 font-extrabold">{getRoleTitle(user.role)}</span>
          </p>

        </div>

        {/* BOTTOM SIGNATURES SECTION */}
        <div className="flex justify-between items-end shrink-0 pt-4 mt-4 border-t border-slate-100">
          
          {/* Left: Certificate registration code details */}
          <div className="text-left text-[9px] text-slate-400 font-bold leading-normal">
            <p>Mã hiệu: BV-ACADEMY/{user.role.toUpperCase()}/{user.xp}</p>
            <p>Hệ thống cấp tự động thời gian thực</p>
            <p>Xếp loại đánh giá: Xuất sắc (Excellent)</p>
          </div>

          {/* Central seal representation (Red vector Stamp - extremely realistic) */}
          <div className="w-24 h-24 relative flex items-center justify-center opacity-90 print:opacity-100">
            {/* Round Red Ink Stamp */}
            <div className="w-20 h-20 rounded-full border-[3px] border-double border-red-600/80 flex items-center justify-center text-center p-1 font-bold text-[6px] text-red-600/90 leading-tight select-none rotate-12 relative">
              <div className="absolute inset-[1.5px] border border-red-600/40 rounded-full pointer-events-none" />
              {/* Star symbol inside seal */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg text-red-600/45">★</div>
              <p className="uppercase scale-95 font-extrabold">CÔNG TY CP XÂY DỰNG BÁCH VIỆT <br /> <span className="text-[5px] tracking-wide">★ ACADEMY ★</span></p>
            </div>
          </div>

          {/* Right: Signature stamp representing BOD */}
          <div className="text-center min-w-[200px]">
            <p className="text-[10px] text-slate-400 font-bold">TP. Hồ Chí Minh, ngày {todayStr}</p>
            <p className="text-[10px] font-extrabold text-slate-700 uppercase tracking-widest mt-1">CHỦ TỊCH HỘI ĐỒNG THI ĐUA</p>
            
            {/* Mock signature graphics */}
            <div className="h-12 relative flex items-center justify-center">
              <svg className="w-28 h-10 select-none text-indigo-500/80" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M10,25 Q30,5 50,22 T90,15" />
                <path d="M15,20 L80,18" strokeSize="1.5" />
              </svg>
            </div>

            <p className="text-xs font-black text-slate-900 leading-none">Bùi Bách Việt</p>
            <span className="text-[9px] text-slate-400 font-bold block mt-0.5">Tổng Giám Đốc Tổng Công Ty</span>
          </div>

        </div>

      </motion.div>

      {/* Trial notification inside play space (hidden back in print) */}
      <div className="max-w-4xl w-full text-center mt-6 text-xs text-slate-400 font-medium print:hidden">
        <p>Bản in ấn hỗ trợ đầy đủ font nền chuẩn mực văn phòng của Tổng công ty. Nhấn Ctrl+P hoặc nút "In Bản Danh Dự" để tiếp nhận.</p>
        <button 
          onClick={onResetProgress}
          className="mt-4 text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center justify-center gap-1.5 mx-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset học tập làm lại bài khảo sát</span>
        </button>
      </div>

    </div>
  );
}
