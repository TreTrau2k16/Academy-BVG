import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

interface UserProfile {
  name: string;
  role: string;
  goal: string;
  streak: number;
  xp: number;
  hearts: number;
  completedLessons: number[];
  certificateClaimed: boolean;
  scoreCard: {
    correct: number;
    wrong: number;
  };
  lastActiveDate?: string;
}

const DB_FILE = path.join(process.cwd(), "profiles_db.json");

// Helper to read database
function readDB(): Record<string, UserProfile> {
  try {
    if (!fs.existsSync(DB_FILE)) {
      // Seed initial mock accounts so the database is pre-populated
      const initialSeed: Record<string, UserProfile> = {
        "Phạm Minh Hoàng": {
          name: "Phạm Minh Hoàng",
          role: "site-engineer",
          goal: "hard",
          streak: 8,
          xp: 580,
          hearts: 5,
          completedLessons: [1, 2],
          certificateClaimed: false,
          scoreCard: { correct: 18, wrong: 2 }
        },
        "Lê Thanh Vân": {
          name: "Lê Thanh Vân",
          role: "architect",
          goal: "normal",
          streak: 5,
          xp: 450,
          hearts: 5,
          completedLessons: [1, 2, 3],
          certificateClaimed: false,
          scoreCard: { correct: 15, wrong: 1 }
        },
        "Trương Quốc Khánh": {
          name: "Trương Quốc Khánh",
          role: "pm-admin",
          goal: "easy",
          streak: 3,
          xp: 320,
          hearts: 5,
          completedLessons: [1],
          certificateClaimed: false,
          scoreCard: { correct: 10, wrong: 0 }
        },
        "Nguyễn Thùy Linh": {
          name: "Nguyễn Thùy Linh",
          role: "pm-admin",
          goal: "normal",
          streak: 2,
          xp: 190,
          hearts: 5,
          completedLessons: [],
          certificateClaimed: false,
          scoreCard: { correct: 5, wrong: 3 }
        }
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialSeed, null, 2), "utf-8");
      return initialSeed;
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database file:", err);
    return {};
  }
}

// Helper to write database
function writeDB(data: Record<string, UserProfile>) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing database file:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API ROUTE: Get all profiles (For Admin view)
  app.get("/api/profiles", (req, res) => {
    try {
      const db = readDB();
      res.json(Object.values(db));
    } catch (err) {
      res.status(500).json({ error: "Lỗi nội bộ server khi lấy danh sách học viên" });
    }
  });

  // API ROUTE: Get a single profile by username/login name
  app.get("/api/profiles/:username", (req, res) => {
    try {
      const username = req.params.username.trim();
      const db = readDB();
      
      if (db[username]) {
        res.json(db[username]);
      } else {
        res.status(404).json({ error: "Không tìm thấy tên đăng nhập này trong cơ sở dữ liệu" });
      }
    } catch (err) {
      res.status(500).json({ error: "Lỗi nội bộ server khi lấy thông tin học viên" });
    }
  });

  // API ROUTE: Create or Update profile by name
  app.post("/api/profiles", (req, res) => {
    try {
      const profile = req.body as UserProfile;
      if (!profile || !profile.name || !profile.name.trim()) {
        return res.status(400).json({ error: "Dữ liệu hồ sơ không hợp lệ" });
      }
      
      const username = profile.name.trim();
      
      // Prevent registering "xdbachvietadmin" as a student username since it is the admin keyword
      if (username.toLowerCase() === "xdbachvietadmin") {
        return res.status(400).json({ error: "Không thể đăng ký làm học viên với tên quản trị viên xdbachvietadmin" });
      }

      const db = readDB();
      db[username] = {
        name: username,
        role: profile.role || "site-engineer",
        goal: profile.goal || "normal",
        streak: profile.streak !== undefined ? profile.streak : 1,
        xp: profile.xp !== undefined ? profile.xp : 0,
        hearts: profile.hearts !== undefined ? profile.hearts : 5,
        completedLessons: profile.completedLessons || [],
        certificateClaimed: !!profile.certificateClaimed,
        scoreCard: profile.scoreCard || { correct: 0, wrong: 0 },
        lastActiveDate: profile.lastActiveDate || new Date().toISOString()
      };
      
      writeDB(db);
      res.json(db[username]);
    } catch (err) {
      res.status(500).json({ error: "Lỗi hệ thống khi lưu trữ thông tin" });
    }
  });

  // API ROUTE: Delete profile (For Admin to manage)
  app.delete("/api/profiles/:username", (req, res) => {
    try {
      const username = req.params.username.trim();
      const db = readDB();
      if (db[username]) {
        delete db[username];
        writeDB(db);
        res.json({ message: "Xóa học viên thành công", name: username });
      } else {
        res.status(404).json({ error: "Mục học viên không tồn tại" });
      }
    } catch (err) {
      res.status(500).json({ error: "Lỗi hệ thống khi xóa học viên" });
    }
  });

  const COURSES_FILE = path.join(process.cwd(), "courses_db.json");

  // Helper to read courses and settings
  function readCourses() {
    try {
      if (fs.existsSync(COURSES_FILE)) {
        return JSON.parse(fs.readFileSync(COURSES_FILE, "utf-8"));
      }
    } catch (e) {
      console.error("Lỗi đọc courses_db:", e);
    }
    return { settings: {}, lessons: [] };
  }

  // API ROUTE: Get courses & settings
  app.get("/api/courses", (req, res) => {
    try {
      const data = readCourses();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Không thể lấy thông tin cấu hình và câu hỏi." });
    }
  });

  // API ROUTE: Save courses & settings
  app.post("/api/courses", (req, res) => {
    try {
      const data = req.body;
      if (!data || !data.lessons || !data.settings) {
        return res.status(400).json({ error: "Cấu trúc dữ liệu yêu cầu không hợp lệ." });
      }
      fs.writeFileSync(COURSES_FILE, JSON.stringify(data, null, 2), "utf-8");
      res.json({ success: true, message: "Cấu hình bài thi và thông số vận hành đã được lưu thành công!" });
    } catch (err) {
      res.status(500).json({ error: "Lỗi hệ thống khi ghi cấu hình và câu hỏi." });
    }
  });

  // API ROUTE: Healthcheck
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Vite middleware setup for Development, otherwise serve UI from dist/ in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bách Việt Academy Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
