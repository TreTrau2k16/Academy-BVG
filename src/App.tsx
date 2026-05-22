/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getLessonsForRole } from './data/lessonsData';
import { UserProfile, Role } from './types';

// Importing our modular views
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import LessonScreen from './components/LessonScreen';
import Certificate from './components/Certificate';
import Handbook from './components/Handbook';
import AdminDashboard from './components/AdminDashboard';

const STORAGE_KEY = 'bachviet_academy_user_profile';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard' | 'lesson' | 'handbook' | 'certificate' | 'admin'>('landing');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [coursesData, setCoursesData] = useState<{ settings: any; lessons: any[] } | null>(null);

  // Fetch customizable courses & settings
  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      if (res.ok) {
        const data = await res.json();
        setCoursesData(data);
      }
    } catch (err) {
      console.warn("Lỗi tải thông số bài học và vận hành, sử dụng mặc định:", err);
    }
  };

  // Load user profile on startup from localStorage
  useEffect(() => {
    fetchCourses();

    const savedAdmin = localStorage.getItem('bachviet_academy_is_admin');
    if (savedAdmin === 'true') {
      setIsAdmin(true);
      setView('admin');
      return;
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: UserProfile = JSON.parse(saved);
        setUserProfile(parsed);
        setView('dashboard');
      } catch (err) {
        console.error('Lỗi phân tích hồ sơ lưu trữ:', err);
      }
    }
  }, []);

  // Save profile to localStorage and keep server database in sync
  const saveProfile = async (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));

    try {
      await fetch('/api/profiles', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
      });
    } catch (err) {
      console.warn("Không thể đồng bộ nền với server, sẽ lưu cục bộ:", err);
    }
  };

  const handleStartOnboarding = async (name: string, role: Role, goal: 'easy' | 'normal' | 'hard') => {
    const newProfile: UserProfile = {
      name,
      role,
      goal,
      streak: 1, // Start with streak of 1 day!
      xp: 0,
      hearts: 5, // Starts with 5 hearts Duolingo style
      completedLessons: [],
      certificateClaimed: false,
      scoreCard: {
        correct: 0,
        wrong: 0
      }
    };

    // Save locally first for instant transitions
    setUserProfile(newProfile);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    setView('dashboard');

    try {
      const response = await fetch('/api/profiles', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProfile)
      });
      if (response.ok) {
        const savedProfile = await response.json();
        setUserProfile(savedProfile);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedProfile));
      }
    } catch (err) {
      console.error('Lỗi ghi học viên mới lên server:', err);
    }
  };

  const handleLoginSuccess = (profile: UserProfile | null, isLoggedAsAdmin: boolean) => {
    if (isLoggedAsAdmin) {
      setIsAdmin(true);
      localStorage.setItem('bachviet_academy_is_admin', 'true');
      setView('admin');
    } else if (profile) {
      setIsAdmin(false);
      localStorage.removeItem('bachviet_academy_is_admin');
      setUserProfile(profile);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      setView('dashboard');
    }
  };

  const handleQuickAccess = () => {
    // Access with randomized default mock profile if they want to peek
    const guestProfile: UserProfile = {
      name: 'Khách Đột Phá',
      role: 'site-engineer',
      goal: 'normal',
      streak: 3,
      xp: 120,
      hearts: 5,
      completedLessons: [1],
      certificateClaimed: false,
      scoreCard: {
        correct: 5,
        wrong: 1
      }
    };
    saveProfile(guestProfile);
    setView('dashboard');
  };

  // Callback when a lesson is clicked
  const handleStartLesson = (lessonId: number) => {
    if (!userProfile) return;
    
    setActiveLessonId(lessonId);
    setView('lesson');
  };

  // Callback when lesson concludes
  const handleLessonFinish = (xpRewardEarned: number) => {
    if (!userProfile || activeLessonId === null) return;

    const lessonsList = activeLessons;
    const completedCopy = [...userProfile.completedLessons];
    
    let earnedXp = xpRewardEarned;
    let correctAdd = 0;
    let wrongAdd = 0;

    if (xpRewardEarned > 0) {
      // Correctly completed!
      if (!completedCopy.includes(activeLessonId)) {
        completedCopy.push(activeLessonId);
      }
      correctAdd = 5; // Simulating correct hits
    } else {
      // Failed!
      wrongAdd = 5;
    }

    const updatedProfile: UserProfile = {
      ...userProfile,
      xp: userProfile.xp + earnedXp,
      hearts: 5, // Keep hearts fully initialized internally but hidden from gameplay
      completedLessons: completedCopy,
      scoreCard: {
        correct: userProfile.scoreCard.correct + correctAdd,
        wrong: userProfile.scoreCard.wrong + wrongAdd
      }
    };

    saveProfile(updatedProfile);
    setActiveLessonId(null);
    setView('dashboard');
  };

  const handleResetProgress = () => {
    if (userProfile) {
      const resetProfile: UserProfile = {
        ...userProfile,
        xp: 0,
        hearts: 5,
        completedLessons: [],
        certificateClaimed: false,
        scoreCard: { correct: 0, wrong: 0 }
      };
      saveProfile(resetProfile);
      setView('dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUserProfile(null);
    setView('landing');
  };

  // Easter egg XP increment when reading a manual
  const handleGrantBonusXp = () => {
    if (!userProfile) return;
    const updated: UserProfile = {
      ...userProfile,
      xp: userProfile.xp + 20
    };
    saveProfile(updated);
  };

  const getDynamicLessons = (): any[] => {
    if (!userProfile) return [];
    if (!coursesData || !coursesData.lessons || coursesData.lessons.length === 0) {
      return getLessonsForRole(userProfile.role);
    }
    const raw = coursesData.lessons;
    const l1 = raw.find(l => l.id === 1);
    const l2 = raw.find(l => l.id === 2);
    const l3 = raw.find(l => l.id === 3 && l.role === userProfile.role) || raw.find(l => l.id === 3);
    const l4 = raw.find(l => l.id === 4);
    const l5 = raw.find(l => l.id === 5);
    return [l1, l2, l3, l4, l5].filter(Boolean);
  };

  const activeLessons = getDynamicLessons();

  return (
    <div id="root-app-viewport" className="min-h-screen bg-slate-50 overflow-x-hidden">
      <AnimatePresence mode="wait">
        
        {view === 'landing' && (
          <motion.div
            key="landing-view animate-fade"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LandingPage 
              onStartOnboarding={handleStartOnboarding} 
              onLoginSuccess={handleLoginSuccess}
              onQuickAccess={handleQuickAccess} 
              dynamicRoles={coursesData?.roles}
            />
          </motion.div>
        )}

        {view === 'admin' && isAdmin && (
          <motion.div
            key="admin-view animate-fade"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <AdminDashboard
              onLogout={handleLogout}
            />
          </motion.div>
        )}

        {view === 'dashboard' && userProfile && (
          <motion.div
            key="dashboard-view animate-fade"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Dashboard
              user={userProfile}
              lessons={activeLessons}
              onStartLesson={handleStartLesson}
              onResetProgress={handleResetProgress}
              onLogout={handleLogout}
              onViewHandbook={() => setView('handbook')}
              onViewCertificate={() => setView('certificate')}
              dynamicRoles={coursesData?.roles}
            />
          </motion.div>
        )}

        {view === 'lesson' && userProfile && activeLessonId !== null && (
          <motion.div
            key="lesson-view animate-fade"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <LessonScreen
              lesson={activeLessons.find(l => l.id === activeLessonId)!}
              onLessonFinish={handleLessonFinish}
              onClose={() => setView('dashboard')}
            />
          </motion.div>
        )}

        {view === 'handbook' && userProfile && (
          <motion.div
            key="handbook-view animate-fade"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Handbook
              onClose={() => setView('dashboard')}
              onGrantBonusXp={handleGrantBonusXp}
              dynamicHandbooks={coursesData?.handbooks}
            />
          </motion.div>
        )}

        {view === 'certificate' && userProfile && (
          <motion.div
            key="certificate-view animate-fade"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Certificate
              user={userProfile}
              onClose={() => setView('dashboard')}
              onResetProgress={handleResetProgress}
              dynamicRoles={coursesData?.roles}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
