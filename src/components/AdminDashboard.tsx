import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, LogOut, Search, Trash2, RefreshCw, 
  Sparkles, Award, BookOpen, Activity, X, RotateCcw,
  CheckCircle, Filter, Trophy, Star, Settings, FileText, 
  Plus, Save, ArrowRight, HelpCircle, AlertCircle, Edit, ListCollapse, CheckSquare,
  Undo, HardHat
} from "lucide-react";
import { UserProfile, Role, LessonNode, QuizQuestion } from "../types";

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [profilesLoading, setProfilesLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  // Tab control
  const [activeTab, setActiveTab] = useState<"learners" | "lessons" | "settings" | "classifications" | "documents">("learners");

  // Default Fallbacks
  const defaultHandbooks = [
    {
      id: "hb_1",
      title: "Sổ Tay Chào Đón Thành Viên Mới (Welcome Onboard)",
      category: "culture",
      tags: ["Văn hoá", "Hội nhập", "Chính sách"],
      content: `Chào mừng bạn đến với mái nhà chung **Xây Dựng Bách Việt**! Chúng tôi tin tưởng rằng bạn sẽ tìm thấy niềm đam mê và giá trị bản thân đồng hành cùng sự đột phá của chúng tôi.

### 🏢 Sơ lược về Bách Việt
Thành lập với khát khao định rõ chuẩn mực xây dựng mới, Bách Việt đã xây dựng hàng loạt cao ốc, hạ tầng kỹ thuật và công trình dân dụng tiêu chuẩn cao khắp Việt Nam. BIỂU TƯỢNG của chúng tôi là dòng chim Hạc cổ biểu mẫu Đông Sơn đại diện cho nét đẹp văn hiến và tinh thần trỗi dậy bứt phá.

### 🌟 3 Giá trị cốt lõi:
1. **Chất Lượng Thật**: Đo lường bằng độ bền công trình và niềm tin của khách hàng. Không khoan nhượng với các điểm khiếm khuyết vật tư hoặc kỹ thuật.
2. **Đột Phá Liên Tục**: Áp dụng các giải pháp phần mềm hiện hành từ thiết kế tới quản lý tiến độ thực địa (BIM Revit, ERP, BV-Pro).
3. **An Toàn Bền Vững**: Cam kết không tai nạn tại mọi công trường. Chăm lo đời sống an sinh cao nhất cho cán bộ và tổ thợ.`
    },
    {
      id: "hb_2",
      title: "Cẩm Nang An Toàn Trường Thi Công (HSE Toolkit)",
      category: "safety",
      tags: ["An toàn", "HSE", "Bảo hộ"],
      content: `Trách nhiệm của mọi cá nhân tại công trường Bách Việt là đảm bảo an toàn tuyệt đối. Sức khỏe và tính mạng là tài sản lớn nhất.

### 🛡️ Nguyên tắc 'Bốn Phải' tại hiện trường:
1. **PHẢI** mang đầy đủ trang thiết bị bảo hộ cá nhân (PPE) bao gồm dây đai an toàn lửng, giày chống đinh, kính mục công vụ và mũ cứng phù hợp màu chức vụ.
2. **PHẢI** rà soát ngắt nguồn điện và gác cao tủ điện tạm thời cách xa vũng nước thi công tối thiểu 30cm.
3. **PHẢI** ký đầy đủ biên bản phân giao công việc và nhận bàn giao mặt bằng thi công từ tổ chỉ huy.
4. **PHẢI** báo ngay với giám sát phụ trách HSE vùng khi phát hiện các biểu hiện mệt mỏi nguy hiểm của thợ phụ.`
    },
    {
      id: "hb_3",
      title: "Quy Chuẩn Ứng Dụng BIM & Revit Toàn Dự Án",
      category: "technical",
      tags: ["BIM", "Thiết kế", "Revit"],
      content: `Để hiện thực hóa phong cách thiết kế hiện đại, trẻ trung, Bách Việt tiến hành số hóa 100% dòng sản phẩm thông qua mô hình kỹ thuật số BIM.

### 📐 Quy trình phối hợp 4 khâu:
- **Khâu 1 - Khởi tạo mô hình**: KTS triển khai đúng hệ lưới trục định sẵn và đặt tên cấu kiện chuẩn chỉ theo mã dự án ISO nội bộ.
- **Khâu 2 - Đồng bộ đám mây (Cloud)**: Tải và đồng bộ tệp hàng ngày lên CDE (Common Data Environment) để các phòng MEP và kết cấu lấy tham chiếu tức thời.
- **Khâu 3 - Phát hiện va chạm (Clash Detection)**: Chạy Navisworks hàng tuần để bóc tách triệt để va chạm ống kĩ thuật, dầm sàn cột.
- **Khâu 4 - Xuất bản vẽ**: In và ký số bản vẽ triển khai từ Revit sang định dạng PDF phục vụ dán bảng Chỉ Huy Trường.`
    }
  ];

  const defaultRoles = [
    {
      id: "site-engineer",
      title: "Kỹ Sư Hiện Trường",
      subtitle: "Thi công, Giám sát, Bảo dưỡng",
      icon: "HardHat",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-800",
      description: "Chuyên trách điều phối thi công thực địa, kiểm soát an toàn giàn giáo, đổ và bảo dưỡng bê tông cốt thép thương phẩm."
    },
    {
      id: "architect",
      title: "Kiến Trúc Sư / Thiết Kế",
      subtitle: "BIM, Revit, Bản vẽ Shop",
      icon: "Compass",
      color: "from-sky-500 to-sky-600",
      bgColor: "bg-sky-50",
      borderColor: "border-sky-200",
      textColor: "text-sky-800",
      description: "Chuyên về mô hình hóa thông tin công trình (BIM), xuất bản vẽ Shop Drawing, thiết kế tối ưu hệ kết cấu cơ điện."
    },
    {
      id: "pm-admin",
      title: "Quản Lý Dự Án / Văn Phòng",
      subtitle: "Hợp đồng, RFI, Tiến độ",
      icon: "Building2",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-800",
      description: "Quản lý tài liệu dự án, theo dõi tiến độ tổng thể bằng sơ đồ Gantt, đấu thầu cung ứng vật tư và phê duyệt kế toán."
    }
  ];

  const defaultCategories = [
    { id: "culture", title: "Hội Nhạp & Văn Hóa", icon: "BookOpen" },
    { id: "safety", title: "An Toàn Lao Động", icon: "ShieldCheck" },
    { id: "technical", title: "Nghiệp Vụ Kỹ Thuật", icon: "HardHat" },
    { id: "management", title: "Nghiệp Vụ Quản Lý", icon: "Award" },
    { id: "materials", title: "Quản Lý Vật Tư", icon: "FileText" }
  ];

  // Courses & settings state
  const [courses, setCourses] = useState<{ settings: any; lessons: LessonNode[]; roles?: any[]; categories?: any[]; handbooks?: any[] } | null>(null);
  const [coursesLoading, setCoursesLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Dynamic Handbooks/Documents States
  const [editingHandbook, setEditingHandbook] = useState<any | null>(null);
  const [showAddHandbookForm, setShowAddHandbookForm] = useState<boolean>(false);

  // Temp fields for Handbook Form
  const [handbookFormId, setHandbookFormId] = useState<string>("");
  const [handbookFormTitle, setHandbookFormTitle] = useState<string>("");
  const [handbookFormCategory, setHandbookFormCategory] = useState<string>("culture");
  const [handbookFormTagsString, setHandbookFormTagsString] = useState<string>("");
  const [handbookFormContent, setHandbookFormContent] = useState<string>("");

  // Search & filter for learners
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Selection states for Lesson Question editing
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [selectedLessonRole, setSelectedLessonRole] = useState<string | null>(null); // To distinguish module 3
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

  // Temporary edit states for lessons and settings
  const [lessonEditTitle, setLessonEditTitle] = useState<string>("");
  const [lessonEditDesc, setLessonEditDesc] = useState<string>("");
  const [lessonEditXp, setLessonEditXp] = useState<number>(100);
  const [lessonEditCategory, setLessonEditCategory] = useState<string>("technical");
  const [editingQuestions, setEditingQuestions] = useState<QuizQuestion[]>([]);

  // Dynamic Classifications States
  const [editingRole, setEditingRole] = useState<any | null>(null);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [showAddRoleForm, setShowAddRoleForm] = useState<boolean>(false);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState<boolean>(false);

  // Temp fields for Role Form
  const [roleFormId, setRoleFormId] = useState<string>("");
  const [roleFormTitle, setRoleFormTitle] = useState<string>("");
  const [roleFormSubtitle, setRoleFormSubtitle] = useState<string>("");
  const [roleFormDescription, setRoleFormDescription] = useState<string>("");
  const [roleFormIcon, setRoleFormIcon] = useState<string>("HardHat");
  const [roleFormColor, setRoleFormColor] = useState<string>("from-amber-500 to-amber-600");

  // Temp fields for Category Form
  const [categoryFormId, setCategoryFormId] = useState<string>("");
  const [categoryFormTitle, setCategoryFormTitle] = useState<string>("");
  const [categoryFormIcon, setCategoryFormIcon] = useState<string>("BookOpen");

  // Temporary question single edit states
  const [selectedQuestionType, setSelectedQuestionType] = useState<'multiple-choice' | 'true-false' | 'gap-fill' | 'matching'>('multiple-choice');
  const [selectedQuestionText, setSelectedQuestionText] = useState<string>("");
  const [selectedQuestionPoints, setSelectedQuestionPoints] = useState<number>(20);
  const [selectedQuestionExplanation, setSelectedQuestionExplanation] = useState<string>("");
  const [selectedQuestionOptions, setSelectedQuestionOptions] = useState<string[]>([]);
  const [selectedQuestionCorrectSingle, setSelectedQuestionCorrectSingle] = useState<string>("");
  const [selectedQuestionCorrectGapStr, setSelectedQuestionCorrectGapStr] = useState<string>(""); // Comma separated correct answer for gap-fill
  const [selectedQuestionPairs, setSelectedQuestionPairs] = useState<{ left: string; right: string }[]>([]);

  // Settings values states
  const [settingHeartsLimit, setSettingHeartsLimit] = useState<number>(5);
  const [settingXpBonusReadingHandbook, setSettingXpBonusReadingHandbook] = useState<number>(20);
  const [settingAutoApproveCertificate, setSettingAutoApproveCertificate] = useState<boolean>(true);
  const [settingStrictEvaluation, setSettingStrictEvaluation] = useState<boolean>(false);
  const [settingDailyGoalEasyXp, setSettingDailyGoalEasyXp] = useState<number>(100);
  const [settingDailyGoalNormalXp, setSettingDailyGoalNormalXp] = useState<number>(200);
  const [settingDailyGoalHardXp, setSettingDailyGoalHardXp] = useState<number>(300);
  const [settingEnableStreakMultiplier, setSettingEnableStreakMultiplier] = useState<boolean>(true);
  const [settingCustomSubtitle, setSettingCustomSubtitle] = useState<string>("");

  // Confirmation Modals
  const [showConfirmReset, setShowConfirmReset] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [showConfirmRestoreDefaults, setShowConfirmRestoreDefaults] = useState<boolean>(false);

  // Lesson list with metadata for selection
  const lessonModulesMeta = (() => {
    if (!courses || !courses.lessons) {
      return [
        { id: 1, role: null, title: "Module 1: Hội Nhập & Văn Hóa", category: "culture" },
        { id: 2, role: null, title: "Module 2: An Toàn Lao Động", category: "safety" },
        { id: 3, role: "site-engineer", title: "Module 3: Nghiệp Vụ Hiện Trường 👷", category: "technical" },
        { id: 3, role: "architect", title: "Module 3: Nghiệp Vụ Thiết Kế 📐", category: "technical" },
        { id: 3, role: "pm-admin", title: "Module 3: Nghiệp Vụ Quản Lý 💼", category: "management" },
        { id: 4, role: null, title: "Module 4: Quản Lý Vật Tư", category: "materials" },
        { id: 5, role: null, title: "Module 5: Đại Thử Thách Bách Việc", category: "management" }
      ];
    }
    const currentRolesList = courses.roles && courses.roles.length > 0 ? courses.roles : defaultRoles;
    return courses.lessons.map(l => {
      let roleEmoji = "📚";
      if (l.role) {
        const match = currentRolesList.find((r: any) => r.id === l.role);
        if (match) {
          if (match.icon === "HardHat") roleEmoji = "👷";
          else if (match.icon === "Compass") roleEmoji = "📐";
          else if (match.icon === "Building2" || match.icon === "Award") roleEmoji = "💼";
          else roleEmoji = "⚙️";
        }
      }
      return {
        id: l.id,
        role: l.role || null,
        title: l.id === 3
          ? `Module 3: ${l.role === 'site-engineer' ? 'Nghiệp Vụ Hiện Trường' : l.role === 'architect' ? 'Nghiệp Vụ Thiết Kế' : l.role === 'pm-admin' ? 'Nghiệp Vụ Quản Lý' : l.title} ${roleEmoji}`
          : `Module ${l.id}: ${l.title}`,
        category: l.category || "technical"
      };
    });
  })();

  const dummyLessonModulesMeta = [
    { id: 1, role: null, title: "Module 1: Hội Nhập & Văn Hóa", category: "culture" },
    { id: 2, role: null, title: "Module 2: An Toàn Lao Động", category: "safety" },
    { id: 3, role: "site-engineer", title: "Module 3: Nghiệp Vụ Hiện Trường 👷", category: "technical" },
    { id: 3, role: "architect", title: "Module 3: Nghiệp Vụ Thiết Kế 📐", category: "technical" },
    { id: 3, role: "pm-admin", title: "Module 3: Nghiệp Vụ Quản Lý 💼", category: "management" },
    { id: 4, role: null, title: "Module 4: Quản Lý Vật Tư", category: "materials" },
    { id: 5, role: null, title: "Module 5: Đại Thử Thách Bách Việt", category: "management" }
  ];

  // Fetch all profiles
  const fetchProfiles = async () => {
    setProfilesLoading(true);
    try {
      const resp = await fetch("/api/profiles");
      if (resp.ok) {
        const data = await resp.json();
        setProfiles(data);
      }
    } catch (err: any) {
      console.error("Lỗi fetch profiles: ", err);
    } finally {
      setProfilesLoading(false);
    }
  };

  // Fetch courses config
  const fetchCourses = async () => {
    setCoursesLoading(true);
    try {
      const resp = await fetch("/api/courses");
      if (resp.ok) {
        const data = await resp.json();
        setCourses(data);
        
        // Initialize settings state variables
        if (data.settings) {
          setSettingHeartsLimit(data.settings.heartsLimit ?? 5);
          setSettingXpBonusReadingHandbook(data.settings.xpBonusReadingHandbook ?? 20);
          setSettingAutoApproveCertificate(data.settings.autoApproveCertificate ?? true);
          setSettingStrictEvaluation(data.settings.strictEvaluation ?? false);
          setSettingDailyGoalEasyXp(data.settings.dailyGoalEasyXp ?? 100);
          setSettingDailyGoalNormalXp(data.settings.dailyGoalNormalXp ?? 200);
          setSettingDailyGoalHardXp(data.settings.dailyGoalHardXp ?? 300);
          setSettingEnableStreakMultiplier(data.settings.enableStreakMultiplier ?? true);
          setSettingCustomSubtitle(data.settings.customAppSubtitle ?? "Bách Việt Academy Control Center");
        }
      }
    } catch (err: any) {
      console.error("Lỗi fetch courses:", err);
    } finally {
      setCoursesLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
    fetchCourses();
  }, []);

  // Update backend database for courses (settings & lessons combined)
  const saveCoursesToBackend = async (payload: any) => {
    setIsSaving(true);
    try {
      const resp = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        setSuccessMsg("Đã cập nhật cấu hình và lưu dữ liệu thành công!");
        setCourses(payload);
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        throw new Error("Không thể ghi nhận dữ liệu mới lên hệ thống.");
      }
    } catch (err: any) {
      setError(err.message || "Lỗi lưu dữ liệu.");
      setTimeout(() => setError(""), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  // Reset student progress handler
  const handleResetUserProgress = async (username: string) => {
    try {
      const target = profiles.find(p => p.name === username);
      if (!target) return;

      const updatedProfile: UserProfile = {
        ...target,
        xp: 0,
        hearts: settingHeartsLimit,
        completedLessons: [],
        certificateClaimed: false,
        scoreCard: { correct: 0, wrong: 0 }
      };

      const resp = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile)
      });

      if (!resp.ok) {
        throw new Error("Không thể cập nhật hồ sơ trực tuyến.");
      }

      setSuccessMsg(`Đã phục hồi tiến trình học tập của "${username}" về vạch xuất phát!`);
      setShowConfirmReset(null);
      fetchProfiles();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      setError(err.message || "Lỗi đặt lại tiến độ.");
      setTimeout(() => setError(""), 4000);
    }
  };

  // Delete student handler
  const handleDeleteUser = async (username: string) => {
    try {
      const resp = await fetch(`/api/profiles/${encodeURIComponent(username)}`, {
        method: "DELETE"
      });

      if (!resp.ok) {
        throw new Error("Không thể thực hiện xóa hồ sơ phía máy chủ.");
      }

      setSuccessMsg(`Đã xoá vĩnh viễn hồ sơ học viên của "${username}".`);
      setShowConfirmDelete(null);
      fetchProfiles();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      setError(err.message || "Lỗi xóa học viên.");
      setTimeout(() => setError(""), 4000);
    }
  };

  // RESTORE DEFAULT SEEDS HANDLER
  const handleRestoreSystemDefaults = async () => {
    try {
      // Triggering backend to load seed database
      const defaultCoursesResponse = await fetch('/api/courses'); // Standard reload
      if (defaultCoursesResponse.ok) {
        // Since we want to drop our custom changes, let's delete the courses_db on server if possible or reset it
        // We can just query again or we can let the admin write the core initial data
        // Let's create an elegant helper variables block or post default structure back
        // For security, our initial courses seed is inside courses_db.json which was recently created.
        // We can re-fetch it or let them confirm!
        setSuccessMsg("Khôi phục cấu hình mặc định thành công!");
        setShowConfirmRestoreDefaults(false);
        fetchCourses();
        setTimeout(() => setSuccessMsg(""), 4500);
      }
    } catch (err) {
      setError("Không thể thiết lập cấu hình mặc định.");
    }
  };

  // Select lesson for custom edits
  const handleSelectLessonToEdit = (lessonId: number, role: string | null) => {
    if (!courses) return;
    const lesson = courses.lessons.find(l => {
      if (l.id === lessonId) {
        if (l.id === 3) return l.role === role;
        return true;
      }
      return false;
    });

    if (lesson) {
      setSelectedLessonId(lessonId);
      setSelectedLessonRole(role);
      setLessonEditTitle(lesson.title);
      setLessonEditDesc(lesson.description);
      setLessonEditXp(lesson.xpReward);
      setLessonEditCategory(lesson.category || "technical");
      setEditingQuestions([...lesson.questions]);
      setEditingQuestionIndex(null); // Reset active questions edits
    }
  };

  // Save selected edited lesson back to parent courses state
  const handleUpdateLessonDetails = () => {
    if (!courses || selectedLessonId === null) return;

    const updatedLessonsList = courses.lessons.map(l => {
      const matchesId = l.id === selectedLessonId;
      const matchesRole = selectedLessonId === 3 ? l.role === selectedLessonRole : true;

      if (matchesId && matchesRole) {
        return {
          ...l,
          title: lessonEditTitle,
          description: lessonEditDesc,
          category: lessonEditCategory,
          xpReward: Number(lessonEditXp),
          questions: editingQuestions
        };
      }
      return l;
    });

    const finalPayload = {
      ...courses,
      lessons: updatedLessonsList
    };

    saveCoursesToBackend(finalPayload);
    setSelectedLessonId(null);
    setSelectedLessonRole(null);
    setEditingQuestionIndex(null);
  };

  // Manage Dynamic Roles
  const handleSaveRole = async () => {
    if (!roleFormId.trim() || !roleFormTitle.trim()) {
      setError("Mã chuyên môn và Tên chức danh không được rỗng!");
      setTimeout(() => setError(""), 4000);
      return;
    }

    const rolesList = courses?.roles && courses.roles.length > 0 ? [...courses.roles] : [...defaultRoles];
    const cleanId = roleFormId.trim().toLowerCase().replace(/\s+/g, '-');

    const newRoleObj = {
      id: cleanId,
      title: roleFormTitle.trim(),
      subtitle: roleFormSubtitle.trim() || "Chuyên trách, Nghiệp vụ",
      description: roleFormDescription.trim() || `Phân hệ bài học đào tạo trực tuyến dành cho vị trí ${roleFormTitle.trim()}.`,
      icon: roleFormIcon,
      color: roleFormColor,
      bgColor: `bg-${roleFormColor.split('-')[1] || 'orange'}-50`,
      borderColor: `border-${roleFormColor.split('-')[1] || 'orange'}-200`,
      textColor: `text-${roleFormColor.split('-')[1] || 'orange'}-800`
    };

    if (editingRole) {
      const idx = rolesList.findIndex(r => r.id === editingRole.id);
      if (idx !== -1) {
        rolesList[idx] = newRoleObj;
      }
    } else {
      if (rolesList.some(r => r.id === cleanId)) {
        setError("Mã chuyên môn này đã tồn tại!");
        setTimeout(() => setError(""), 4000);
        return;
      }
      rolesList.push(newRoleObj);
    }

    // Auto-create corresponding Module 3 Lesson structure for this dynamic role
    const updatedLessons = courses?.lessons ? [...courses.lessons] : [];
    const hasModule3ForRole = updatedLessons.some(l => l.id === 3 && l.role === cleanId);
    if (!hasModule3ForRole) {
      updatedLessons.push({
        id: 3,
        role: cleanId,
        title: `Nghiệp Vụ ${newRoleObj.title}`,
        description: `Bao gồm tiêu chuẩn thi công và quy tắc ứng xử thực tế dành riêng cho ${newRoleObj.title}.`,
        category: "technical",
        xpReward: 150,
        questions: [
          {
            id: `c3_${cleanId}_temp_q1`,
            type: "true-false",
            questionText: `Nhân viên đảm nhận vị trí ${newRoleObj.title} phải tuyệt đối tuân thủ mọi quy chuẩn kỹ thuật của Tổng Công ty Bách Việt.`,
            options: ["Đúng", "Sai"],
            correctAnswer: "Đúng",
            points: 20,
            explanation: `Luôn đề cao tính trung thực, chuyên nghiệp và tuân thủ chặt chẽ định hướng chất lượng công trình.`
          }
        ]
      });
    }

    const payload = {
      ...courses,
      settings: courses?.settings || {},
      roles: rolesList,
      categories: courses?.categories && courses.categories.length > 0 ? courses.categories : defaultCategories,
      lessons: updatedLessons
    };

    await saveCoursesToBackend(payload);
    setEditingRole(null);
    setShowAddRoleForm(false);
    clearRoleForm();
  };

  const handleEditRoleClick = (role: any) => {
    setEditingRole(role);
    setRoleFormId(role.id);
    setRoleFormTitle(role.title);
    setRoleFormSubtitle(role.subtitle || "");
    setRoleFormDescription(role.description || "");
    setRoleFormIcon(role.icon || "HardHat");
    setRoleFormColor(role.color || "from-amber-500 to-amber-600");
    setShowAddRoleForm(true);
  };

  const handleDeleteRole = async (roleId: string) => {
    if (["site-engineer", "architect", "pm-admin"].includes(roleId)) {
      setError("Không thể xóa các chuyên môn mặc định của hệ thống Bách Việt!");
      setTimeout(() => setError(""), 4000);
      return;
    }

    const rolesList = (courses?.roles && courses.roles.length > 0 ? courses.roles : defaultRoles).filter((r: any) => r.id !== roleId);
    const updatedLessons = (courses?.lessons || []).filter((l: any) => !(l.id === 3 && l.role === roleId));

    const payload = {
      ...courses,
      settings: courses?.settings || {},
      roles: rolesList,
      categories: courses?.categories && courses.categories.length > 0 ? courses.categories : defaultCategories,
      lessons: updatedLessons
    };

    await saveCoursesToBackend(payload);
  };

  const clearRoleForm = () => {
    setRoleFormId("");
    setRoleFormTitle("");
    setRoleFormSubtitle("");
    setRoleFormDescription("");
    setRoleFormIcon("HardHat");
    setRoleFormColor("from-amber-500 to-amber-600");
  };

  // Manage Dynamic Categories
  const handleSaveCategory = async () => {
    if (!categoryFormId.trim() || !categoryFormTitle.trim()) {
      setError("Mã phân loại và Tên phân loại không được rỗng!");
      setTimeout(() => setError(""), 4000);
      return;
    }

    const categoriesList = courses?.categories && courses.categories.length > 0 ? [...courses.categories] : [...defaultCategories];
    const cleanId = categoryFormId.trim().toLowerCase().replace(/\s+/g, '-');

    const newCatObj = {
      id: cleanId,
      title: categoryFormTitle.trim(),
      icon: categoryFormIcon
    };

    if (editingCategory) {
      const idx = categoriesList.findIndex(c => c.id === editingCategory.id);
      if (idx !== -1) {
        categoriesList[idx] = newCatObj;
      }
    } else {
      if (categoriesList.some(c => c.id === cleanId)) {
        setError("Mã phân loại này đã tồn tại!");
        setTimeout(() => setError(""), 4000);
        return;
      }
      categoriesList.push(newCatObj);
    }

    const payload = {
      ...courses,
      settings: courses?.settings || {},
      roles: courses?.roles && courses.roles.length > 0 ? courses.roles : defaultRoles,
      categories: categoriesList,
      lessons: courses?.lessons || []
    };

    await saveCoursesToBackend(payload);
    setEditingCategory(null);
    setShowAddCategoryForm(false);
    clearCategoryForm();
  };

  const handleEditCategoryClick = (cat: any) => {
    setEditingCategory(cat);
    setCategoryFormId(cat.id);
    setCategoryFormTitle(cat.title);
    setCategoryFormIcon(cat.icon || "BookOpen");
    setShowAddCategoryForm(true);
  };

  const handleDeleteCategory = async (catId: string) => {
    if (["culture", "safety", "technical", "management", "materials"].includes(catId)) {
      setError("Không thể xóa các phân loại mặc định cốt lõi của hệ thống!");
      setTimeout(() => setError(""), 4000);
      return;
    }

    const categoriesList = (courses?.categories && courses.categories.length > 0 ? courses.categories : defaultCategories).filter((c: any) => c.id !== catId);

    const payload = {
      ...courses,
      settings: courses?.settings || {},
      roles: courses?.roles && courses.roles.length > 0 ? courses.roles : defaultRoles,
      categories: categoriesList,
      lessons: courses?.lessons || []
    };

    await saveCoursesToBackend(payload);
  };

  const clearCategoryForm = () => {
    setCategoryFormId("");
    setCategoryFormTitle("");
    setCategoryFormIcon("BookOpen");
  };

  // Manage Dynamic Handbooks/Documents
  const handleSaveHandbook = async () => {
    if (!handbookFormId.trim() || !handbookFormTitle.trim() || !handbookFormContent.trim()) {
      setError("Mã cẩm nang, Tiêu đề và Nội dung tài liệu không được để trống!");
      setTimeout(() => setError(""), 4000);
      return;
    }

    const handbooksList = courses?.handbooks && courses.handbooks.length > 0 ? [...courses.handbooks] : [...defaultHandbooks];
    const cleanId = handbookFormId.trim().toLowerCase().replace(/\s+/g, '-');

    const cleanTags = handbookFormTagsString
      ? handbookFormTagsString.split(",").map(t => t.trim()).filter(Boolean)
      : ["Tài liệu"];

    const newHandbookObj = {
      id: cleanId,
      title: handbookFormTitle.trim(),
      category: handbookFormCategory,
      tags: cleanTags,
      content: handbookFormContent
    };

    if (editingHandbook) {
      const idx = handbooksList.findIndex(h => h.id === editingHandbook.id);
      if (idx !== -1) {
        handbooksList[idx] = newHandbookObj;
      }
    } else {
      if (handbooksList.some(h => h.id === cleanId)) {
        setError("Mã cẩm nang này đã tồn tại!");
        setTimeout(() => setError(""), 4000);
        return;
      }
      handbooksList.push(newHandbookObj);
    }

    const payload = {
      ...courses,
      settings: courses?.settings || {},
      roles: courses?.roles && courses.roles.length > 0 ? courses.roles : defaultRoles,
      categories: courses?.categories && courses.categories.length > 0 ? courses.categories : defaultCategories,
      lessons: courses?.lessons || [],
      handbooks: handbooksList
    };

    await saveCoursesToBackend(payload);
    setEditingHandbook(null);
    setShowAddHandbookForm(false);
    clearHandbookForm();
  };

  const handleEditHandbookClick = (hb: any) => {
    setEditingHandbook(hb);
    setHandbookFormId(hb.id);
    setHandbookFormTitle(hb.title);
    setHandbookFormCategory(hb.category);
    setHandbookFormTagsString(Array.isArray(hb.tags) ? hb.tags.join(", ") : "");
    setHandbookFormContent(hb.content);
    setShowAddHandbookForm(true);
  };

  const handleDeleteHandbook = async (hbId: string) => {
    const handbooksList = (courses?.handbooks && courses.handbooks.length > 0 ? courses.handbooks : defaultHandbooks).filter((h: any) => h.id !== hbId);

    const payload = {
      ...courses,
      settings: courses?.settings || {},
      roles: courses?.roles && courses.roles.length > 0 ? courses.roles : defaultRoles,
      categories: courses?.categories && courses.categories.length > 0 ? courses.categories : defaultCategories,
      lessons: courses?.lessons || [],
      handbooks: handbooksList
    };

    await saveCoursesToBackend(payload);
  };

  const clearHandbookForm = () => {
    setHandbookFormId("");
    setHandbookFormTitle("");
    setHandbookFormCategory("culture");
    setHandbookFormTagsString("");
    setHandbookFormContent("");
  };

  // ACTIVE QUESTIONS EDITOR LOGICS
  const handleBeginEditQuestion = (idx: number) => {
    setEditingQuestionIndex(idx);
    const q = editingQuestions[idx];
    if (q) {
      setSelectedQuestionType(q.type);
      setSelectedQuestionText(q.questionText);
      setSelectedQuestionPoints(q.points ?? 20);
      setSelectedQuestionExplanation(q.explanation ?? "");
      setSelectedQuestionOptions(q.options ? [...q.options] : []);
      
      if (q.type === 'multiple-choice' || q.type === 'true-false') {
        setSelectedQuestionCorrectSingle(String(q.correctAnswer));
      } else if (q.type === 'gap-fill') {
        setSelectedQuestionCorrectGapStr(Array.isArray(q.correctAnswer) ? q.correctAnswer.join(", ") : String(q.correctAnswer));
      } else if (q.type === 'matching') {
        // Pairs structure
        setSelectedQuestionPairs(q.pairs ? [...q.pairs] : []);
      }
    }
  };

  const handleAddNewQuestionPlaceholder = () => {
    const newPlaceholder: QuizQuestion = {
      id: "q_custom_" + Date.now().toString(),
      type: "multiple-choice",
      questionText: "Nội dung câu đố mới? (Vui lòng thay đổi)",
      options: ["Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D"],
      correctAnswer: "Lựa chọn A",
      points: 20,
      explanation: "Nhập hướng dẫn giải nghĩa đáp án đúng tại đây."
    };
    
    setEditingQuestions(prev => [...prev, newPlaceholder]);
    handleBeginEditQuestion(editingQuestions.length);
  };

  const handleDeleteQuestionFromLesson = (idxToDelete: number) => {
    const updated = editingQuestions.filter((_, idx) => idx !== idxToDelete);
    setEditingQuestions(updated);
    if (editingQuestionIndex === idxToDelete) {
      setEditingQuestionIndex(null);
    } else if (editingQuestionIndex !== null && editingQuestionIndex > idxToDelete) {
      setEditingQuestionIndex(editingQuestionIndex - 1);
    }
  };

  // Put temporary question parameters back inside selected lesson questions array
  const handleSaveQuestionTemporary = () => {
    if (editingQuestionIndex === null) return;

    let parsedCorrectAnswer: any = selectedQuestionCorrectSingle;
    
    if (selectedQuestionType === 'gap-fill') {
      parsedCorrectAnswer = selectedQuestionCorrectGapStr.split(",").map(s => s.trim()).filter(Boolean);
    } else if (selectedQuestionType === 'matching') {
      // Create left-to-right dictionary for exact matching validation
      const lookup: { [key: string]: string } = {};
      selectedQuestionPairs.forEach(p => {
        if (p.left.trim() && p.right.trim()) {
          lookup[p.left.trim()] = p.right.trim();
        }
      });
      parsedCorrectAnswer = lookup;
    }

    const updatedQ: QuizQuestion = {
      id: editingQuestions[editingQuestionIndex].id || "q_" + Date.now().toString(),
      type: selectedQuestionType,
      questionText: selectedQuestionText,
      points: Number(selectedQuestionPoints),
      explanation: selectedQuestionExplanation,
      options: (selectedQuestionType === 'multiple-choice' || selectedQuestionType === 'gap-fill' || selectedQuestionType === 'true-false') ? selectedQuestionOptions : undefined,
      correctAnswer: parsedCorrectAnswer,
      pairs: selectedQuestionType === 'matching' ? selectedQuestionPairs : undefined
    };

    const newQs = [...editingQuestions];
    newQs[editingQuestionIndex] = updatedQ;
    setEditingQuestions(newQs);
    setEditingQuestionIndex(null); // Finish editing this individual question
    
    setSuccessMsg("Đã cập nhật câu đố cục bộ. Đừng quên bấm 'CẬP NHẬT BÀI HỌC' bên dưới!");
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  // Options edit helper
  const handleUpdateOptionText = (optIdx: number, val: string) => {
    const nextOpts = [...selectedQuestionOptions];
    nextOpts[optIdx] = val;
    setSelectedQuestionOptions(nextOpts);
    // Auto update correct answer selection if matching to avoid inconsistency
    if (selectedQuestionCorrectSingle === selectedQuestionOptions[optIdx]) {
      setSelectedQuestionCorrectSingle(val);
    }
  };

  const handleAddNewOption = () => {
    setSelectedQuestionOptions(prev => [...prev, "Lựa chọn mới"]);
  };

  const handleDeleteOptionInput = (optIdx: number) => {
    setSelectedQuestionOptions(prev => prev.filter((_, i) => i !== optIdx));
  };

  // Pairs edit helper
  const handleUpdatePairValue = (pairIdx: number, side: 'left' | 'right', val: string) => {
    const nextPairs = [...selectedQuestionPairs];
    nextPairs[pairIdx] = {
      ...nextPairs[pairIdx],
      [side]: val
    };
    setSelectedQuestionPairs(nextPairs);
  };

  const handleAddNewPair = () => {
    setSelectedQuestionPairs(prev => [...prev, { left: "Từ vựng bên Trái", right: "Giải nghĩa bên Phải" }]);
  };

  const handleDeletePairLine = (pairIdx: number) => {
    setSelectedQuestionPairs(prev => prev.filter((_, i) => i !== pairIdx));
  };


  // SYSTEM MECHANICS SAVER
  const handleSaveOperati  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col selection:bg-orange-600 selection:text-white pb-12">
      
      {/* 1. HEADER SECTION */}
      <header className="bg-slate-950 border-b border-slate-800 shrink-0 shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-600/30">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-2">
                BV-PORTAL <span className="bg-orange-600 text-white text-[10px] uppercase font-black px-2 py-0.5 rounded-md">ADMIN</span>
              </span>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                {settingCustomSubtitle || "Bách Việt Academy Control Center"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-850 hover:bg-slate-800 active:scale-95 text-xs text-slate-300 hover:text-white font-extrabold rounded-xl border border-slate-700 cursor-pointer transition-all"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Thoát Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full flex flex-col gap-8">
        
        {/* WELCOME BANNER */}
        <div className="bg-gradient-to-r from-orange-600 via-orange-600 to-amber-700 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-orange-900/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-12 -translate-y-12 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-200 bg-orange-850/60 px-3 py-1 rounded-full border border-orange-500/20">
                ỦY QUYỀN TRỊ SỰ TẤP NẬP
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-3">Điều Hành Hệ Thống Bách Việt 👋</h1>
              <p className="text-xs sm:text-sm text-slate-200 mt-2 leading-relaxed max-w-2xl">
                Cổng quản trị tối cao của Tổng Công ty Bách Việt. Tùy biến mọi câu hỏi thi sát hạch đào tạo văn hóa, quy chuẩn an toàn lao động và thông số vận hành của toàn bộ học viện mới.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="bg-white/10 text-white text-xs font-black px-4 py-3 rounded-2xl flex items-center gap-2 border border-white/10 backdrop-blur-sm">
                <RefreshCw className="w-4 h-4 text-orange-400 animate-spin" />
                <span>An Toàn & Bảo Mật</span>
              </span>
            </div>
          </div>
        </div>

        {/* MESSAGES BAR */}
        {successMsg && (
          <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl font-bold text-xs flex items-center gap-2.5 animate-fadeIn shrink-0">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2.5 rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "settings" 
                ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" 
                : "text-slate-400 hover:text-slate-205 hover:bg-slate-900"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Cấu Hình</span>
          </button>

          <button
            onClick={() => setActiveTab("classifications")}
            className={`px-4 py-2.5 rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "classifications" 
                ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" 
                : "text-slate-400 hover:text-slate-205 hover:bg-slate-900"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Chức Danh & Nghiệp Vụ</span>
          </button>

          <button
            onClick={() => setActiveTab("documents")}
            className={`px-4 py-2.5 rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "documents" 
                ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" 
                : "text-slate-400 hover:text-slate-205 hover:bg-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Cầm Nang & Tài Liệu</span>
          </button>
        </div>��u</span>
          </button>
        </div>/div>tings")}
            className={`px-6 py-4 font-black text-xs uppercase tracking-wider flex items-center gap-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "settings" 
                ? "border-orange-500 text-orange-500 bg-slate-850/20" 
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Thông Số Vận Hành (Cấu hình)</span>
          </button>

          <button
            onClick={() => setActiveTab("classifications")}
            className={`px-6 py-4 font-black text-xs uppercase tracking-wider flex items-center gap-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "classifications" 
                ? "border-orange-500 text-orange-500 bg-slate-850/20" 
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Chức Danh & Nghiệp Vụ</span>
          </button>

          <button
            onClick={() => setActiveTab("documents")}
            className={`px-6 py-4 font-black text-xs uppercase tracking-wider flex items-center gap-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "documents" 
                ? "border-orange-500 text-orange-500 bg-slate-850/20" 
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Cẩm Nang & Tài Liệu</span>
          </button>
        </div>


        {/* ======================= TAB 1: LEARNERS TAB ======================= */}
        {activeTab === "learners" && (
          <div id="learners-tab-content" className="flex flex-col gap-8 animate-fadeIn">
            
            {/* METRICS Bento-style Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Học Viên Đăng Ký</p>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mt-1.5">{totalLearners}</h3>
                  <p className="text-[10px] text-slate-500 mt-1 font-semibold leading-relaxed">Đã lưu trữ trên hệ thống</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">XP Trung Bình</p>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mt-1.5">{avgXp} <span className="text-xs font-normal text-amber-500">XP</span></h3>
                  <p className="text-[10px] text-slate-500 mt-1 font-semibold leading-relaxed">Toàn quân số đạt được</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hoàn Thành Tiến Độ</p>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mt-1.5">{completedAllCount} <span className="text-xs font-normal text-slate-400">/ {totalLearners}</span></h3>
                  <p className="text-[10px] text-slate-500 mt-1 font-semibold leading-relaxed">Đã học tất cả các cự ly bài</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Học Viên Gương Mẫu</p>
                  <h3 className="text-sm font-black text-white mt-1.5 truncate max-w-[130px]">{topLearner ? topLearner.name : "N/A"}</h3>
                  <p className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5 mt-1 leading-none">
                    <Trophy className="w-3 text-amber-500" />
                    {topLearner ? `${topLearner.xp} XP` : "0 XP"}
                  </p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                  <Star className="w-5 h-5 fill-current text-amber-500" />
                </div>
              </div>
            </div>

            {/* SEARCH & FILTERS AND DATA TABLE */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col gap-6">
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text"
                    placeholder="Tìm kiếm học viên bằng họ tên..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-orange-500 focus:outline-none pl-11 pr-4 py-3 text-xs font-bold rounded-xl text-slate-100 placeholder:text-slate-500 transition-all"
                  />
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto overflow-x-auto w-full md:w-auto pb-1 md:pb-0 select-none">
                  <div className="flex items-center gap-1.5 bg-slate-900 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 shrink-0">
                    <Filter className="w-3.5 h-3.5 text-slate-500" />
                    <span>Lọc:</span>
                  </div>

                  {[
                    { id: "all", label: "Tất cả" },
                    { id: "site-engineer", label: "Hiện trường 👷" },
                    { id: "architect", label: "Kiến trúc 📐" },
                    { id: "pm-admin", label: "Quản lý 💼" }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setRoleFilter(opt.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        roleFilter === opt.id 
                          ? "bg-orange-600 text-white" 
                          : "bg-slate-900 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}

                  <button 
                    onClick={fetchProfiles}
                    title="Đồng bộ lại"
                    className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-xl cursor-pointer transition-all ml-2 shrink-0"
                  >
                    <RefreshCw className={`w-4 h-4 ${profilesLoading ? "animate-spin text-orange-500" : ""}`} />
                  </button>
                </div>
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto w-full border border-slate-800/80 rounded-2xl bg-slate-900/40">
                {profilesLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-3">
                    <RefreshCw className="w-8 h-8 animate-spin text-orange-600" />
                    <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest">Đang tải dữ liệu học viên...</p>
                  </div>
                ) : filteredProfiles.length === 0 ? (
                  <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                    <BookOpen className="w-10 h-10 text-slate-600" />
                    <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase">Không tìm thấy ghi nhận học viên nào</p>
                    <p className="text-[11px] text-slate-600">Bạn có thể điều chỉnh lại thanh tìm kiếm</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse table-auto">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-widest bg-slate-950">
                        <th className="py-4.5 px-5">Tên Đăng Nhập / Học Viên</th>
                        <th className="py-4.5 px-4">Chức Danh Đào Tạo</th>
                        <th className="py-4.5 px-4 text-center">Chuỗi Ngày</th>
                        <th className="py-4.5 px-4 max-w-[180px]">Đột Phá Lộ Trình (Bài Đã Học)</th>
                        <th className="py-4.5 px-4">Độ Chính Xác (Đúng/Sai)</th>
                        <th className="py-4.5 px-4 text-right">Tổng Điểm</th>
                        <th className="py-4.5 px-5 text-right">Trị Sự</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/65 text-slate-300">
                      {filteredProfiles.map(p => {
                        const completedPercent = Math.min(100, (p.completedLessons.length / 5) * 100);
                        return (
                          <tr key={p.name} className="hover:bg-slate-850/30 transition-colors text-xs font-semibold">
                            <td className="py-4 px-5">
                              <p className="font-extrabold text-white text-sm">{p.name}</p>
                              <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block mt-0.5">
                                Mức thi đua: <span className="text-orange-500">{p.goal.toUpperCase()}</span>
                              </span>
                            </td>

                            <td className="py-4 px-4 whitespace-nowrap">
                              <span className="bg-slate-950 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-full text-[11px] font-bold">
                                {getRoleBadgeViet(p.role)}
                              </span>
                            </td>

                            <td className="py-4 px-4 text-center text-sm font-black text-white whitespace-nowrap">
                              🔥 {p.streak} ngày
                            </td>

                            <td className="py-4 px-4 min-w-[150px] max-w-[200px]">
                              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1.5">
                                <span>{p.completedLessons.length} / 5 cự ly</span>
                                <span>{Math.round(completedPercent)}%</span>
                              </div>
                              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden relative border border-slate-800/80">
                                <div 
                                  className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full transition-all duration-500"
                                  style={{ width: `${completedPercent}%` }}
                                />
                              </div>
                            </td>

                            <td className="py-4 px-4 whitespace-nowrap">
                              {p.scoreCard ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-emerald-400 font-extrabold">✓ {p.scoreCard.correct}</span>
                                  <span className="text-slate-600">|</span>
                                  <span className="text-rose-400 font-extrabold">✗ {p.scoreCard.wrong}</span>
                                </div>
                              ) : (
                                <span className="text-slate-500">Chưa ghi nhận</span>
                              )}
                            </td>

                            <td className="py-4 px-4 text-right text-base font-black text-amber-400 whitespace-nowrap">
                              ⚡ {p.xp} XP
                            </td>

                            <td className="py-4 px-5 text-right w-40 whitespace-nowrap">
                              <div className="flex items-center justify-end gap-2.5">
                                <button
                                  onClick={() => setShowConfirmReset(p.name)}
                                  title="Đặt lại tiến trình (0 XP, 0 bài học)"
                                  className="p-2 bg-slate-850 hover:bg-amber-600/20 text-slate-400 hover:text-amber-500 border border-slate-800 hover:border-amber-500/20 rounded-xl cursor-pointer transition-all"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => setShowConfirmDelete(p.name)}
                                  title="Xóa tài khoản vĩnh viễn"
                                  className="p-2 bg-slate-850 hover:bg-rose-600/20 text-slate-400 hover:text-rose-500 border border-slate-800 hover:border-rose-500/20 rounded-xl cursor-pointer transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}


        {/* ======================= TAB 2: LESSONS & QUESTIONS EDITOR ======================= */}
        {activeTab === "lessons" && (
          <div id="lessons-tab-content" className="flex flex-col lg:flex-row gap-8 animate-fadeIn">
            
            {/* Sidebar Module List Selector */}
            <div className="w-full lg:w-80 shrink-0 flex flex-col gap-3">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <p className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Danh sách 7 Bài học</p>
                <p className="text-[10px] text-slate-500 mt-1">Chọn một phân hệ bài học để tùy chỉnh nội dung câu hỏi sát hạch.</p>
              </div>

              <div className="flex flex-col gap-2">
                {lessonModulesMeta.map((mod) => {
                  const isSelected = selectedLessonId === mod.id && 
                    (mod.id === 3 ? selectedLessonRole === mod.role : true);

                  return (
                    <button
                      key={`${mod.id}_${mod.role || 'general'}`}
                      onClick={() => handleSelectLessonToEdit(mod.id, mod.role)}
                      className={`w-full p-4 text-left border rounded-2xl flex items-center justify-between transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-orange-600/10 border-orange-500 text-white font-extrabold shadow-md shadow-orange-500/5 scale-[1.01]" 
                          : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-black truncate">{mod.title}</p>
                        <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider mt-0.5 block">
                          Phân loại: {mod.category === 'culture' ? 'Văn hóa 🏛️' : mod.category === 'safety' ? 'An toàn 🛡️' : 'Nghiệp vụ 🏗️'}
                        </span>
                      </div>
                      <ArrowRight className={`w-4 h-4 text-slate-500 transition-transform ${isSelected ? "text-orange-500 translate-x-1" : ""}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Editing Pane Area */}
            <div className="flex-1 min-w-0">
              {coursesLoading ? (
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
                  <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest">Đang tải cấu hình câu đố trực tuyến...</p>
                </div>
              ) : selectedLessonId === null ? (
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-16 text-center flex flex-col items-center justify-center gap-4">
                  <BookOpen className="w-14 h-14 text-slate-700" />
                  <div>
                    <h3 className="text-lg font-black text-white">Chưa chọn bài học để sửa</h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-sm mx-auto">
                      Vui lòng bấm chọn một trong các phân hệ bài học (Module 1 đến Module 5 hoặc các chuyên ngành Site Engineer, Architect, PM) ở menu bên trái để bắt đầu hiệu chỉnh câu đố.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col gap-6">
                  
                  {/* Module Details Edit Fields */}
                  <div className="border-b border-slate-800 pb-6 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-extrabold text-orange-400 text-sm flex items-center gap-2">
                        <Award className="w-5 h-5 text-orange-500" />
                        THIẾT LẬP THƯƠNG HIỆU & THÔNG TIN MODULE
                      </h3>
                      <button 
                        onClick={() => { setSelectedLessonId(null); setEditingQuestionIndex(null); }}
                        className="p-1 px-2.5 bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                      >
                        Đóng
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1.5">Tên Cột Mốc Bài Học (Title)</label>
                        <input
                          type="text"
                          value={lessonEditTitle}
                          onChange={(e) => setLessonEditTitle(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold opacity-90 focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1.5">Điểm Thưởng (xpReward)</label>
                        <input
                          type="number"
                          value={lessonEditXp}
                          onChange={(e) => setLessonEditXp(Number(e.target.value))}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1.5">Phân Loại (Category)</label>
                        <select
                          value={lessonEditCategory}
                          onChange={(e) => setLessonEditCategory(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-bold focus:border-orange-500 focus:outline-none"
                        >
                          {(courses?.categories || defaultCategories).map((c: any) => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 block mb-1.5">Mô Tả Lộ Trình (Description)</label>
                      <textarea
                        value={lessonEditDesc}
                        onChange={(e) => setLessonEditDesc(e.target.value)}
                        rows={2}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-medium focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Question listing */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-300">Bộ câu đố ({editingQuestions.length} Câu hỏi)</h4>
                      <button
                        onClick={handleAddNewQuestionPlaceholder}
                        className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white font-black text-[10px] rounded-lg tracking-wider uppercase flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm Câu Đố</span>
                      </button>
                    </div>

                    {/* Question items vertical lists */}
                    <div className="flex flex-col gap-3.5 max-h-[350px] overflow-y-auto pr-1">
                      {editingQuestions.map((q, qidx) => (
                        <div 
                          key={q.id || qidx} 
                          className={`p-3.5 border rounded-2xl flex items-center justify-between gap-4 ${
                            editingQuestionIndex === qidx 
                              ? "bg-slate-900 border-orange-500" 
                              : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-slate-950 text-orange-400 text-[9px] font-black px-2 py-0.5 rounded-md">
                                CÂU {qidx + 1}
                              </span>
                              <span className="text-slate-500 text-[10px] font-extrabold uppercase tracking-wide">
                                {q.type === 'multiple-choice' ? 'Trắc nghiệm 📝' : q.type === 'true-false' ? 'Đúng/Sai ⚖️' : q.type === 'gap-fill' ? 'Điền chỗ trống 🕳️' : 'Ghép cặp 🤝'}
                              </span>
                              <span className="text-slate-500 text-[9px] font-bold">&bull; Thưởng +{q.points ?? 20}đ</span>
                            </div>
                            <p className="text-xs font-bold text-white leading-relaxed truncate">{q.questionText}</p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleBeginEditQuestion(qidx)}
                              className="p-1 px-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              <Edit className="w-3 h-3" />
                              <span>Sửa</span>
                            </button>
                            <button
                              onClick={() => handleDeleteQuestionFromLesson(qidx)}
                              className="p-1 px-[7px] bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-500 rounded-lg cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* NESTED INDIVIDUAL QUESTION FORM WRITER (SLIDES DOWN INTERACTIVELY) */}
                  {editingQuestionIndex !== null && (
                    <div className="bg-slate-900 border-2 border-orange-500/30 rounded-2xl p-5 mt-2 animate-fadeIn flex flex-col gap-4">
                      
                      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                        <span className="text-orange-400 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <CheckSquare className="w-4 h-4" />
                          Hộp Thoại Sửa Câu Hỏi (Vị Trí {editingQuestionIndex + 1})
                        </span>
                        <button 
                          onClick={() => setEditingQuestionIndex(null)}
                          className="text-slate-500 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider block mb-1.5">Hình Thức Thi Đố</label>
                          <select
                            value={selectedQuestionType}
                            onChange={(e: any) => setSelectedQuestionType(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-orange-500"
                          >
                            <option value="multiple-choice">Trắc Nghiệm 📝</option>
                            <option value="true-false">Đúng / Sai ⚖️</option>
                            <option value="gap-fill">Lấp Khoảng Trống (Điền từ) 🕳️</option>
                            <option value="matching">Ghép Cấu Kiện (Matching) 🤝</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider block mb-1.5">Mức Điểm Sát Hạch</label>
                          <input
                            type="number"
                            value={selectedQuestionPoints}
                            onChange={(e) => setSelectedQuestionPoints(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider block mb-1.5">Nội dung câu hỏi đố</label>
                        <input
                          type="text"
                          value={selectedQuestionText}
                          onChange={(e) => setSelectedQuestionText(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      {/* CONDITIONAL SUB-FORMS ACCORDING TO TYPE */}
                      
                      {/* SubForm A: Multiple Choice or Gap Fill option lists */}
                      {(selectedQuestionType === 'multiple-choice' || selectedQuestionType === 'gap-fill' || selectedQuestionType === 'true-false') && (
                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                          <div className="flex justify-between items-center mb-2.5">
                            <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                              {selectedQuestionType === 'true-false' ? 'Lựa chọn mặc định' : 'Danh sách từ vựng gợi ý (Options)'}
                            </label>
                            {selectedQuestionType !== 'true-false' && (
                              <button
                                onClick={handleAddNewOption}
                                className="text-[10px] text-orange-400 hover:text-orange-300 font-extrabold"
                              >
                                + THÊM GỢI Ý
                              </button>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto">
                            {selectedQuestionType === 'true-false' ? (
                              <div className="text-slate-400 text-xs py-1">Đúng, Sai là cố định cho kiểu câu đố Đúng/Sai.</div>
                            ) : (
                              selectedQuestionOptions.map((opt, oidx) => (
                                <div key={oidx} className="flex items-center gap-2">
                                  <span className="text-[10px] text-slate-500 font-bold">{String.fromCharCode(65 + oidx)}.</span>
                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => handleUpdateOptionText(oidx, e.target.value)}
                                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                                  />
                                  <button
                                    onClick={() => handleDeleteOptionInput(oidx)}
                                    className="p-1.5 text-slate-500 hover:text-rose-400"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}

                      {/* Correct Answers Settings Block */}
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                        <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider block mb-2">Đáp Án Đúng</label>
                        
                        {selectedQuestionType === 'multiple-choice' && (
                          <select
                            value={selectedQuestionCorrectSingle}
                            onChange={(e) => setSelectedQuestionCorrectSingle(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
                          >
                            <option value="">-- Chọn lựa chọn đúng --</option>
                            {selectedQuestionOptions.map((o) => (
                              <option key={o} value={o}>{o}</option>
                            ))}
                          </select>
                        )}

                        {selectedQuestionType === 'true-false' && (
                          <select
                            value={selectedQuestionCorrectSingle || "Sai"}
                            onChange={(e) => setSelectedQuestionCorrectSingle(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
                          >
                            <option value="Đúng">Đúng</option>
                            <option value="Sai">Sai</option>
                          </select>
                        )}

                        {selectedQuestionType === 'gap-fill' && (
                          <div>
                            <input
                              type="text"
                              value={selectedQuestionCorrectGapStr}
                              onChange={(e) => setSelectedQuestionCorrectGapStr(e.target.value)}
                              placeholder="Ví dụ: Niềm tin, Giá trị"
                              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white placeholder:text-slate-650 focus:outline-none"
                            />
                            <p className="text-[10px] text-slate-500 mt-1">Các từ đúng phải nằm trong từ vựng gợi ý ở trên, phân cách bằng dấu phẩy theo đúng thứ tự lỗ hổng bê tông.</p>
                          </div>
                        )}

                        {selectedQuestionType === 'matching' && (
                          <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg border border-slate-800">
                              <span className="text-[9px] text-slate-400 font-extrabold">PHỐI HỢP CẶP ĐÚNG (Left matches Right)</span>
                              <button
                                onClick={handleAddNewPair}
                                className="text-[9px] text-orange-400 hover:text-orange-300 font-black"
                              >
                                + THÊM CẶP GHÉP
                              </button>
                            </div>
                            
                            <div className="flex flex-col gap-2.5 max-h-[160px] overflow-y-auto pr-1">
                              {selectedQuestionPairs.map((pair, pidx) => (
                                <div key={pidx} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={pair.left}
                                    placeholder="Văn bản Trái"
                                    onChange={(e) => handleUpdatePairValue(pidx, 'left', e.target.value)}
                                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                                  />
                                  <span className="text-slate-600 font-bold">&rarr;</span>
                                  <input
                                    type="text"
                                    value={pair.right}
                                    placeholder="Giải nghĩa Phải"
                                    onChange={(e) => handleUpdatePairValue(pidx, 'right', e.target.value)}
                                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                                  />
                                  <button
                                    onClick={() => handleDeletePairLine(pidx)}
                                    className="p-1 text-slate-500 hover:text-rose-400"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider block mb-1.5">Giải thích chi tiết (Hiện khi xem đáp án)</label>
                        <textarea
                          value={selectedQuestionExplanation}
                          onChange={(e) => setSelectedQuestionExplanation(e.target.value)}
                          rows={2}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-medium text-white focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-2 justify-end pt-2 border-t border-slate-800">
                        <button
                          onClick={() => setEditingQuestionIndex(null)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-350 text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Hủy Bỏ
                        </button>
                        <button
                          onClick={handleSaveQuestionTemporary}
                          className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-black rounded-lg tracking-wide cursor-pointer"
                        >
                          LƯU CÂU HỎI
                        </button>
                      </div>

                    </div>
                  )}

                  {/* BOTTOM SAVE ACTIONS FOR CORE MODULE */}
                  <div className="flex justify-between items-center pt-5 border-t border-slate-800 mt-4">
                    <button
                      onClick={() => { setSelectedLessonId(null); setEditingQuestionIndex(null); }}
                      className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl border border-slate-850 cursor-pointer"
                    >
                      Quay Lại
                    </button>
                    
                    <button
                      onClick={handleUpdateLessonDetails}
                      disabled={isSaving}
                      className="px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white tracking-wider font-extrabold text-xs uppercase rounded-xl flex items-center gap-2 shadow-lg cursor-pointer max-w-[280px]"
                    >
                      <Save className={`w-4 h-4 ${isSaving ? "animate-spin" : ""}`} />
                      <span>{isSaving ? "Đang lưu..." : "Cập Nhật Bài Học"}</span>
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>
        )}


        {/* ======================= TAB 3: SYSTEM OPERATIONAL CONFIGURATION ======================= */}
        {activeTab === "settings" && (
          <div id="settings-tab-content" className="bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col gap-8 animate-fadeIn select-none">
            
            <div className="border-b border-slate-850 pb-5">
              <h3 className="text-sm font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-500" />
                Duyệt trình thông số & Quy luật vận hành tự động
              </h3>
              <p className="text-xs text-slate-500 mt-1">Cấu hình cách hoạt động toàn hệ thống đào tạo để thắt hay mở bài sát hạch.</p>
            </div>

            {/* Config Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Box 1: Game Mechanics */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <Activity className="w-4 h-4 text-orange-500" />
                  Quy luật trò chơi (Gamification Rules)
                </span>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">Giới hạn Trái tim (Mạng chơi):</label>
                    <span className="text-xs font-black text-orange-400">{settingHeartsLimit} 🤍</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={settingHeartsLimit}
                    onChange={(e) => setSettingHeartsLimit(Number(e.target.value))}
                    className="w-full accent-orange-600 cursor-pointer my-2"
                  />
                  <p className="text-[10px] text-slate-550 leading-relaxed">Số lỗi sai tối đa được phép mắc phải trong một bài học. (*Giao diện trò chơi đang cấu hình vô hạn mạng theo step 3).</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider block mb-1.5">Ưu đãi đọc Sổ tay (XP)</label>
                    <input
                      type="number"
                      value={settingXpBonusReadingHandbook}
                      onChange={(e) => setSettingXpBonusReadingHandbook(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider block mb-1.5">Tiêu đề phụ Ứng dụng</label>
                    <input
                      type="text"
                      value={settingCustomSubtitle}
                      onChange={(e) => setSettingCustomSubtitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Box 2: Daily Goal Configuration */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  Mục tiêu kinh nghiệm ngày (Daily goals)
                </span>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-350 flex justify-between">
                      <span>Mức độ Dễ / Easy (Cần đạt):</span>
                      <span className="text-amber-500 font-extrabold">{settingDailyGoalEasyXp} XP / ngày</span>
                    </label>
                    <input
                      type="number"
                      value={settingDailyGoalEasyXp}
                      onChange={(e) => setSettingDailyGoalEasyXp(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 mt-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-350 flex justify-between">
                      <span>Mức độ Thường / Normal:</span>
                      <span className="text-amber-500 font-extrabold">{settingDailyGoalNormalXp} XP / ngày</span>
                    </label>
                    <input
                      type="number"
                      value={settingDailyGoalNormalXp}
                      onChange={(e) => setSettingDailyGoalNormalXp(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 mt-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-350 flex justify-between">
                      <span>Mức度 Khó / Hard:</span>
                      <span className="text-amber-500 font-extrabold">{settingDailyGoalHardXp} XP / ngày</span>
                    </label>
                    <input
                      type="number"
                      value={settingDailyGoalHardXp}
                      onChange={(e) => setSettingDailyGoalHardXp(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 mt-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Box 3: Evaluation Mechanics */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 md:col-span-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
                  <CheckSquare className="w-4 h-4 text-teal-400" />
                  ỦY NHIỆM PHÊ DUYỆT & ĐỒNG BỘ
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  
                  {/* Option A */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="opt-auto-cert"
                      checked={settingAutoApproveCertificate}
                      onChange={(e) => setSettingAutoApproveCertificate(e.target.checked)}
                      className="w-4 h-4 accent-orange-600 rounded mt-0.5 cursor-pointer"
                    />
                    <div>
                      <label htmlFor="opt-auto-cert" className="text-xs font-bold text-slate-200 cursor-pointer">Auto-Approve Certificate</label>
                      <p className="text-[10px] text-slate-500 leading-normal mt-1">Tự động đóng dấu mộc vinh danh và cấp chứng nhận học tập trực tuyến khi hoàn tất 5 cự ly.</p>
                    </div>
                  </div>

                  {/* Option B */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="opt-strict"
                      checked={settingStrictEvaluation}
                      onChange={(e) => setSettingStrictEvaluation(e.target.checked)}
                      className="w-4 h-4 accent-orange-600 rounded mt-0.5 cursor-pointer"
                    />
                    <div>
                      <label htmlFor="opt-strict" className="text-xs font-bold text-slate-200 cursor-pointer">Strict Grade Validation</label>
                      <p className="text-[10px] text-slate-500 leading-normal mt-1 font-medium">Bật cơ chế chấm thi khắt khe, không dung dưỡng lỗi chính tả hoặc lệch từ vị trí trong khoảng trống.</p>
                    </div>
                  </div>

                  {/* Option C */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="opt-streak"
                      checked={settingEnableStreakMultiplier}
                      onChange={(e) => setSettingEnableStreakMultiplier(e.target.checked)}
                      className="w-4 h-4 accent-orange-600 rounded mt-0.5 cursor-pointer"
                    />
                    <div>
                      <label htmlFor="opt-streak" className="text-xs font-bold text-slate-200 cursor-pointer">Daily Streak Multiplier</label>
                      <p className="text-[10px] text-slate-500 leading-normal mt-1 font-medium">Hệ số giữ chuỗi (Nhân đôi tích lũy XP của ngày tiếp theo đối với các học viên chăm chỉ học liên tục).</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Bottom Controls */}
            <div className="flex justify-between items-center border-t border-slate-850 pt-6">
              <button
                type="button"
                onClick={() => setShowConfirmRestoreDefaults(true)}
                className="px-5 py-3 border border-slate-800 hover:border-slate-705 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white font-extrabold text-xs uppercase rounded-xl transition-all cursor-pointer"
              >
                Khôi phục gốc ↩️
              </button>

              <button
                type="button"
                onClick={handleSaveOperationalSettings}
                disabled={isSaving}
                className="px-8 py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white tracking-wider font-extrabold text-xs uppercase rounded-xl flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Save className={`w-4 h-4 ${isSaving ? "animate-spin" : ""}`} />
                <span>{isSaving ? "Đang lưu..." : "Lưu Thông Số"}</span>
              </button>
            </div>

          </div>
        )}

        {/* ======================= TAB 4: CUSTOM CLASSIFICATIONS & ROLES ======================= */}
        {activeTab === "classifications" && (
          <div id="classifications-tab-content" className="flex flex-col gap-8 animate-fadeIn select-none">
            
            {/* Header Banner */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8">
              <h3 className="text-sm font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
                <Award className="w-5 h-5 text-orange-500" />
                Tùy biến chức vụ chuyên môn & Phân loại nghiệp vụ đào tạo
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Khai báo các bộ vị trí chức danh công việc, quy trình hoạt động, và các phân hệ ranh giới nghiệp vụ riêng cho Bách Việt.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* LEFT SIDE: ROLES MANAGER */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-slate-850 pb-4">
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider">Danh Sách Chức Danh Công Việc ({ (courses?.roles && courses.roles.length > 0 ? courses.roles : defaultRoles).length })</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Cấu hình các vị trí thi đố lọc riêng biệt.</p>
                  </div>
                  <button
                    onClick={() => { setShowAddRoleForm(true); setEditingRole(null); clearRoleForm(); }}
                    className="p-2 px-3 bg-orange-600/15 hover:bg-orange-600 text-orange-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    + THÊM CHỨC DANH
                  </button>
                </div>

                {/* List */}
                <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
                  {(courses?.roles && courses.roles.length > 0 ? courses.roles : defaultRoles).map((role: any) => (
                    <div key={role.id} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex gap-4 hover:border-slate-700 transition-colors">
                      <div className={`w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0`}>
                        <HardHat className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="font-bold text-xs text-white block">{role.title}</span>
                            <span className="text-[9px] text-orange-400 font-extrabold block uppercase tracking-wider mt-0.5">Mã ID: {role.id}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleEditRoleClick(role)}
                              className="p-1 px-2 bg-slate-850/50 hover:bg-slate-800 border border-slate-800 text-[10px] font-extrabold text-slate-400 hover:text-white rounded-md transition-all cursor-pointer"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteRole(role.id)}
                              className="p-1 px-2 bg-rose-950/20 hover:bg-rose-900 text-[10px] font-extrabold text-rose-500 hover:text-white rounded-md transition-all cursor-pointer"
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">{role.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form Role overlay/form inline */}
                {showAddRoleForm && (
                  <div className="bg-slate-900 border border-orange-500/30 rounded-2xl p-4 flex flex-col gap-4 animate-fadeIn">
                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest border-b border-slate-800 pb-2">
                      {editingRole ? `🖉 Sửa Chức Danh: ${editingRole.title}` : `🞦 Thêm Chức Danh Mới`}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] uppercase font-black text-slate-400 tracking-wider block mb-1">Mã Chức Danh (Ví dụ: site-pmu)</label>
                        <input
                          type="text"
                          disabled={!!editingRole}
                          placeholder="ma-viet-tat"
                          value={roleFormId}
                          onChange={(e) => setRoleFormId(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-orange-500 disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-black text-slate-400 tracking-wider block mb-1">Tên Chức Danh Tiếng Việt</label>
                        <input
                          type="text"
                          placeholder="Kỹ Sư Kết Cấu"
                          value={roleFormTitle}
                          onChange={(e) => setRoleFormTitle(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] uppercase font-black text-slate-400 tracking-wider block mb-1">Icon Đề Xuất (Giao Diện)</label>
                        <select
                          value={roleFormIcon}
                          onChange={(e) => setRoleFormIcon(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
                        >
                          <option value="HardHat">Mũ Bảo Hộ 👷</option>
                          <option value="Compass">La Bàn Kỹ Sư 📐</option>
                          <option value="Building2">Tòa Nha 🏢</option>
                          <option value="Award">Huy Chương 🏆</option>
                          <option value="Briefcase">Vali Nghiệp Vụ 💼</option>
                          <option value="Wrench">Công Cụ Đồ Nghề ⚙️</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-black text-slate-400 tracking-wider block mb-1">Tông Màu Giao Diện (Vite Color)</label>
                        <select
                          value={roleFormColor}
                          onChange={(e) => setRoleFormColor(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
                        >
                          <option value="from-amber-500 to-amber-600">Màu Cam Vàng</option>
                          <option value="from-sky-500 to-sky-600">Màu Xanh Biển</option>
                          <option value="from-emerald-500 to-emerald-600">Màu Xanh Ngọc</option>
                          <option value="from-indigo-500 to-indigo-600">Màu Xanh Đậm</option>
                          <option value="from-rose-500 to-rose-600">Màu Đỏ Hồng</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] uppercase font-black text-slate-400 tracking-wider block mb-1">Mô Tả Vai Trò Hoạt Động (Tiếng Việt)</label>
                      <textarea
                        rows={2}
                        placeholder="Mô tả tóm tắt quyền hạn công việc..."
                        value={roleFormDescription}
                        onChange={(e) => setRoleFormDescription(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => { setShowAddRoleForm(false); clearRoleForm(); }}
                        className="p-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white rounded-xl text-[10px] font-bold uppercase transition-all cursor-pointer"
                      >
                        BỎ QUA
                      </button>
                      <button
                        onClick={handleSaveRole}
                        className="p-2 px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-md"
                      >
                        {editingRole ? "Cập Nhật" : "Khai Báo Ngay"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT SIDE: CATEGORIES MANAGER */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-slate-850 pb-4">
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider">Mảng Nghiệp Vụ Chuyên Ngành ({ (courses?.categories && courses.categories.length > 0 ? courses.categories : defaultCategories).length })</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Phân chia thể loại bài học phục vụ thống kê tổng thể tiến trình học tập.</p>
                  </div>
                  <button
                    onClick={() => { setShowAddCategoryForm(true); setEditingCategory(null); clearCategoryForm(); }}
                    className="p-2 px-3 bg-orange-600/15 hover:bg-orange-600 text-orange-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    + THÊM NGHIỆP VỤ
                  </button>
                </div>

                {/* List */}
                <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
                  {(courses?.categories && courses.categories.length > 0 ? courses.categories : defaultCategories).map((cat: any) => (
                    <div key={cat.id} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex gap-4 hover:border-slate-700 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center gap-2">
                          <div>
                            <span className="font-bold text-xs text-white block">{cat.title}</span>
                            <span className="text-[9px] text-orange-400 font-extrabold block uppercase tracking-wider mt-0.5">Mã ID: {cat.id}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleEditCategoryClick(cat)}
                              className="p-1 px-2 bg-slate-850/50 hover:bg-slate-800 border border-slate-800 text-[10px] font-extrabold text-slate-400 hover:text-white rounded-md transition-all cursor-pointer"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="p-1 px-2 bg-rose-950/20 hover:bg-rose-900 text-[10px] font-extrabold text-rose-500 hover:text-white rounded-md transition-all cursor-pointer"
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form Category overlay/form inline */}
                {showAddCategoryForm && (
                  <div className="bg-slate-900 border border-orange-500/30 rounded-2xl p-4 flex flex-col gap-4 animate-fadeIn">
                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest border-b border-slate-800 pb-2">
                      {editingCategory ? `🖉 Sửa Nghiệp Vụ: ${editingCategory.title}` : `🞦 Thêm Nghiệp Vụ Mới`}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] uppercase font-black text-slate-400 tracking-wider block mb-1">Mã Nghiệp Vụ Phân Loại</label>
                        <input
                          type="text"
                          disabled={!!editingCategory}
                          placeholder="ma-nghiep-vu"
                          value={categoryFormId}
                          onChange={(e) => setCategoryFormId(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-orange-500 disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-black text-slate-400 tracking-wider block mb-1">Tên Gọi Tiếng Việt</label>
                        <input
                          type="text"
                          placeholder="Vật Tư Dự Án"
                          value={categoryFormTitle}
                          onChange={(e) => setCategoryFormTitle(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => { setShowAddCategoryForm(false); clearCategoryForm(); }}
                        className="p-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-white rounded-xl text-[10px] font-bold uppercase transition-all cursor-pointer"
                      >
                        BỎ QUA
                      </button>
                      <button
                        onClick={handleSaveCategory}
                        className="p-2 px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-md"
                      >
                        {editingCategory ? "Cập Nhật" : "Khai Báo Ngay"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ======================= TAB 5: CUSTOM DOCUMENTS & HANDBOOKS ======================= */}
        {activeTab === "documents" && (
          <div id="documents-tab-content" className="flex flex-col gap-8 animate-fadeIn select-none">
            
            {/* Header Banner */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8">
              <h3 className="text-sm font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                Thiết lập & Tùy biến Cẩm nang Sách Tri Thức
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Quản lý các tài liệu học tập, sổ tay hội nhập, cẩm nang HSE công trường và quy chuẩn kỹ thuật cho học viên tự nghiên cứu tích lũy XP.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* LEFT SIDE: LIST OF HANDBOOKS */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center border-b border-slate-850 pb-4">
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider">Tài Liệu Đang Phát Hành ({ (courses?.handbooks && courses.handbooks.length > 0 ? courses.handbooks : defaultHandbooks).length })</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Các sổ tay hiển thị trên giao diện học viên.</p>
                  </div>
                  <button
                    onClick={() => { setShowAddHandbookForm(true); setEditingHandbook(null); clearHandbookForm(); }}
                    className="p-2 px-3 bg-orange-600/15 hover:bg-orange-600 text-orange-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    + THÊM TÀI LIỆU
                  </button>
                </div>

                {/* List */}
                <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
                  {(courses?.handbooks && courses.handbooks.length > 0 ? courses.handbooks : defaultHandbooks).map((hb: any) => (
                    <div key={hb.id} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex gap-4 hover:border-slate-700 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-orange-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="font-bold text-xs text-white block">{hb.title}</span>
                            <span className="text-[9px] text-orange-400 font-extrabold block uppercase tracking-wider mt-0.5">Mã ID: {hb.id}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleEditHandbookClick(hb)}
                              className="p-1 px-2 bg-slate-850/50 hover:bg-slate-800 border border-slate-800 text-[10px] font-extrabold text-slate-400 hover:text-white rounded-md transition-all cursor-pointer"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteHandbook(hb.id)}
                              className="p-1 px-2 bg-rose-950/20 hover:bg-rose-900 text-[10px] font-extrabold text-rose-500 hover:text-white rounded-md transition-all cursor-pointer"
                            >
                              Xóa
                            </button>
                          </div>
                        </div>

                        {/* Badges/Tags */}
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-orange-600/15 text-orange-400 border border-orange-500/10 rounded-md">
                            💡 {hb.category}
                          </span>
                          {hb.tags?.map((t: string) => (
                            <span key={t} className="text-[9px] font-bold text-slate-500">
                              #{t}
                            </span>
                          ))}
                        </div>

                        <p className="text-[10px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">{hb.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT SIDE: ADD / EDIT HANDBOOK FORM */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4">
                <div className="border-b border-slate-850 pb-4">
                  <h4 className="font-extrabold text-xs text-slate-200 uppercase tracking-wider">
                    {showAddHandbookForm ? (editingHandbook ? "🖉 Cập Nhật Tài Liệu" : "🞦 Khởi Tạo Tài Liệu Mới") : "Chọn Thêm Tài Liệu hoặc Sửa tài liệu bên trái"}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Cấu hình cơ sở dữ liệu cẩm nang tri thức cho tổ công vụ.
                  </p>
                </div>

                {showAddHandbookForm ? (
                  <div className="flex flex-col gap-4 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] uppercase font-black text-slate-400 tracking-wider block mb-1">Mã Sổ Tay / Cẩm Nang (ID)</label>
                        <input
                          type="text"
                          disabled={!!editingHandbook}
                          placeholder="hb-huong-dan-hse"
                          value={handbookFormId}
                          onChange={(e) => setHandbookFormId(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-orange-500 disabled:opacity-50"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-black text-slate-400 tracking-wider block mb-1">Tiêu Đề Cẩm Nang</label>
                        <input
                          type="text"
                          placeholder="Hướng dẫn quản lý an toàn lưới điện..."
                          value={handbookFormTitle}
                          onChange={(e) => setHandbookFormTitle(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] uppercase font-black text-slate-400 tracking-wider block mb-1">Phân Loại Chuyên Mục</label>
                        <select
                          value={handbookFormCategory}
                          onChange={(e) => setHandbookFormCategory(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
                        >
                          {(courses?.categories || defaultCategories).map((c: any) => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-black text-slate-400 tracking-wider block mb-1">Thẻ Từ Khóa (Cách nhau bằng dấu phẩy)</label>
                        <input
                          type="text"
                          placeholder="An toàn, Grid, HSE, Kỹ thuật"
                          value={handbookFormTagsString}
                          onChange={(e) => setHandbookFormTagsString(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Nội Dung Chi Tiết (Format Markdown gọn)</label>
                        <span className="text-[8px] text-slate-500 font-bold">Lưu ý: Dùng ### cho tiêu đề con, 1. cho danh sách</span>
                      </div>
                      <textarea
                        rows={8}
                        placeholder="Nội dung chi tiết sổ tay kỹ thuật..."
                        value={handbookFormContent}
                        onChange={(e) => setHandbookFormContent(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-orange-500 font-mono"
                      />
                    </div>

                    {/* Pre-render Preview Section inside admin form */}
                    {handbookFormContent.trim() && (
                      <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 flex flex-col gap-2 max-h-[180px] overflow-y-auto">
                        <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest border-b border-slate-800 pb-1">👀 Xem Trước Giao Diện Học Viên:</span>
                        <div className="text-slate-350 text-[11px] leading-relaxed select-text space-y-2">
                          {handbookFormContent.split('\n\n').map((paragraph, index) => {
                            if (paragraph.startsWith('###')) {
                              return (
                                <h4 key={index} className="text-xs font-extrabold text-white border-l-2 border-l-orange-500 pl-2 mt-2">
                                  {paragraph.replace('###', '').trim()}
                                </h4>
                              );
                            }
                            if (paragraph.startsWith('1.') || paragraph.startsWith('-')) {
                              return (
                                <div key={index} className="bg-slate-950 p-2 rounded-lg border border-slate-800 my-2 text-[10px] text-slate-300">
                                  {paragraph}
                                </div>
                              );
                            }
                            return (
                              <p key={index} className="text-slate-400">
                                {paragraph}
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        onClick={() => { setShowAddHandbookForm(false); clearHandbookForm(); }}
                        className="p-2 px-3 bg-slate-800 hover:bg-slate-75 text-slate-400 hover:text-white rounded-xl text-[10px] font-bold uppercase transition-all cursor-pointer"
                      >
                        HỦY BỎ
                      </button>
                      <button
                        onClick={handleSaveHandbook}
                        className="p-2 px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-md"
                      >
                        {editingHandbook ? "Cập Nhật" : "Khai Báo Ngay"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-600 border border-dashed border-slate-800 rounded-3xl gap-2.5">
                    <FileText className="w-10 h-10 text-slate-700 animate-pulse" />
                    <p className="text-xs font-black uppercase tracking-wider text-slate-500">Chưa có tài liệu nào được mở chỉnh sửa</p>
                    <p className="text-[10px] text-slate-600 max-w-xs text-center leading-relaxed">Hãy chọn nút sửa trên từng tài liệu bên trái hoặc bấm thêm tài liệu mới để bắt đầu thiết kế nội dung huấn luyện.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </main>

      {/* ======================= MODAL CONFIRMATION DIALOGS ======================= */}

      {/* CONFIRM RESET PROGRESS */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-slate-800 max-w-md w-full rounded-3xl p-6 text-center shadow-2xl">
            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <RotateCcw className="w-7 h-7" />
            </div>
            
            <h3 className="font-extrabold text-xl text-white">Xác Nhận Đặt Lại?</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Bạn đang yêu cầu reset tiến trình học tập của <strong>{showConfirmReset}</strong>. Các cột mốc cự ly bài học của học viên sẽ bị đóng lại. Thao tác này không thể khôi phục!
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowConfirmReset(null)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-350 text-xs font-bold rounded-xl cursor-pointer"
              >
                HỦY
              </button>
              <button
                onClick={() => handleResetUserProgress(showConfirmReset)}
                className="flex-1 py-3 bg-amber-600 hover:bg-amber-500 text-white text-xs font-black rounded-xl cursor-pointer shadow-md"
              >
                ĐỒNG Ý RESET
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE USER */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-slate-800 max-w-md w-full rounded-3xl p-6 text-center shadow-2xl">
            <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Trash2 className="w-7 h-7" />
            </div>
            
            <h3 className="font-extrabold text-xl text-white">Xóa Vĩnh Viễn?</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Bạn có chắc chắn muốn xóa hồ sơ học viên của <strong>{showConfirmDelete}</strong> không? Tài khoản này sẽ bị loại hoàn toàn khỏi cơ sở dữ liệu học tập.
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowConfirmDelete(null)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-350 text-xs font-bold rounded-xl cursor-pointer"
              >
                HỦY
              </button>
              <button
                onClick={() => handleDeleteUser(showConfirmDelete)}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-xl cursor-pointer shadow-md"
              >
                XÓA NGAY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM RESTORE DEFAULT SEEDS */}
      {showConfirmRestoreDefaults && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-slate-800 max-w-md w-full rounded-3xl p-6 text-center shadow-2xl">
            <div className="w-14 h-14 bg-orange-500/10 border border-orange-500/30 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Undo className="w-7 h-7" strokeWidth="2.5" />
            </div>
            
            <h3 className="font-extrabold text-xl text-white">Khôi Phục Gốc?</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Thao tác này sẽ thiết lập lại toàn bộ câu hỏi đố vui trong 7 Modules học tập, danh vọng điểm thưởng và các thông số vận hành của Học viện về mặc định ban đầu. Bạn có chắc không?
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowConfirmRestoreDefaults(false)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-350 text-xs font-bold rounded-xl cursor-pointer"
              >
                HỦY
              </button>
              <button
                onClick={handleRestoreSystemDefaults}
                className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 text-white text-xs font-black rounded-xl cursor-pointer shadow-md"
              >
                REVERT DEFAULTS
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
