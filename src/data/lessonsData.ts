/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LessonNode, Role, LessonCategory, QuizQuestion } from '../types';

// Let's declare each lesson as a strongly-typed LessonNode for 100% type safety.

const cultureLesson: LessonNode = {
  id: 1,
  title: "Hội Nhập & Văn Hóa Bách Việt",
  description: "Tìm hiểu về lịch sử hình thành, tầm nhìn chiến lược và 3 giá trị cốt lõi làm nên thương hiệu Bách Việt.",
  category: "culture" as LessonCategory,
  xpReward: 100,
  questions: [
    {
      id: "c1_q1",
      type: "multiple-choice",
      questionText: "Ý nghĩa của biểu tượng Chim Hạc trong Logo của Tổng Công ty Xây dựng Bách Việt là gì?",
      options: [
        "Khát vọng vươn cao, sự bền vững trường tồn và tinh hoa văn hóa Việt Nam",
        "Sự nhanh chóng, tốc độ hoàn thành dự án vượt trội",
        "Mô phỏng máy bay và cần cẩu tháp hiện đại",
        "Thể hiện tinh thần yêu thiên nhiên và bảo vệ động vật hoang dã"
      ],
      correctAnswer: "Khát vọng vươn cao, sự bền vững trường tồn và tinh hoa văn hóa Việt Nam",
      points: 20,
      explanation: "Logo hình chim Hạc của Bách Việt kế thừa từ họa tiết trống đồng Đông Sơn, đại diện cho khát vọng cất cánh bay cao, sự trường tồn cùng năm tháng và cam kết tạo nên những công trình mang tính di sản quốc gia."
    },
    {
      id: "c1_q2",
      type: "true-false",
      questionText: "Giá trị cốt lõi 'Đột phá' tại Bách Việt có nghĩa là khuyến khích nhân viên tự ý thay đổi quy trình thiết kế mà không cần phê duyệt.",
      options: ["Đúng", "Sai"],
      correctAnswer: "Sai",
      points: 15,
      explanation: "'Đột phá' khuyến khích sáng tạo cải tiến công nghệ (như BIM, IoT công trường) nhưng vẫn phải tuyệt đối tuân thủ quy trình kiểm soát chất lượng nghiêm ngặt của dự án."
    },
    {
      id: "c1_q3",
      type: "gap-fill",
      questionText: "Phương châm hành động của Bách Việt là: 'Xây dựng bằng... , dựng xây những...'",
      options: ["Khát vọng", "Trái tim", "Niềm tin", "Di sản", "Giá trị", "Công trình"],
      correctAnswer: ["Niềm tin", "Giá trị"],
      points: 25,
      explanation: "Slogan đầy đủ: 'Xây dựng bằng niềm tin, dựng xây những giá trị'. Cam kết mang đức tín lên hàng đầu để kiến tạo công trình trường tồn."
    },
    {
      id: "c1_q4",
      type: "multiple-choice",
      questionText: "Tại Bách Việt, hệ thống kênh giao tiếp & thông báo chính thức toàn công ty được vận hành trên nền tảng nào?",
      options: [
        "WhatsApp & Telegram cá nhân",
        "Ứng dụng Workspace nội bộ (BV-Portal) & Email công vụ (@bachvietcon.com.vn)",
        "Chỉ trao đổi bằng văn bản giấy ký tay",
        "Nhóm chat Facebook Messenger công cộng"
      ],
      correctAnswer: "Ứng dụng Workspace nội bộ (BV-Portal) & Email công vụ (@bachvietcon.com.vn)",
      points: 20,
      explanation: "Mọi văn bản hành chính, quy trình nghiệm thu và thông báo khẩn cấp đều phải cập nhật qua BV-Portal và Email chính thức đóng đuôi @bachvietcon.com.vn để bảo mật thông tin."
    },
    {
      id: "c1_q5",
      type: "matching",
      questionText: "Hãy ghép đúng các Bộ phận tương ứng với Trách nhiệm chính tại công trường Bách Việt:",
      pairs: [
        { left: "Ban Chỉ Huy Công Trường", right: "Điều phối thi công thực tế và giám sát tiến độ thầu phụ" },
        { left: "Bộ phận Giám sát HSE", right: "Tuân thủ an toàn, vệ sinh môi trường & bảo hộ lao động" },
        { left: "Bộ phận QA/QC", right: "Kiểm soát chất lượng vật liệu đầu vào và quy chuẩn nghiệm thu" }
      ],
      correctAnswer: {
        "Ban Chỉ Huy Công Trường": "Điều phối thi công thực tế và giám sát tiến độ thầu phụ",
        "Bộ phận Giám sát HSE": "Tuân thủ an toàn, vệ sinh môi trường & bảo hộ lao động",
        "Bộ phận QA/QC": "Kiểm soát chất lượng vật liệu đầu vào và quy chuẩn nghiệm thu"
      },
      points: 25,
      explanation: "Mỗi bộ phận đóng vai trò mắt xích vàng đảm bảo công trường vận hành an toàn, chất lượng và đúng tiến độ cam kết."
    }
  ]
};

const safetyLesson: LessonNode = {
  id: 2,
  title: "An Toàn Lao Động & Quy Tắc HSE",
  description: "Tiêu chuẩn tối cao tại mọi công trường Bách Việt. Học để bảo vệ bản thân và các đồng nghiệp xung quanh.",
  category: "safety" as LessonCategory,
  xpReward: 120,
  questions: [
    {
      id: "c2_q1",
      type: "multiple-choice",
      questionText: "Nguyên tắc '3 Không' khi làm việc trên giàn giáo cao tại Bách Việt bao gồm những gì?",
      options: [
        "Không thắt dây an toàn, Không có mũ bảo hiểm, Không có giám sát",
        "Không tự ý leo trèo ngoài thang dẫn, Không làm việc khi thời tiết giông lốc, Không ném công cụ vật tư từ trên cao xuống",
        "Không mang điện thoại, Không nói chuyện, Không uống nước",
        "Không mang giày bảo hộ, Không mặc áo phản quang, Không đeo găng tay"
      ],
      correctAnswer: "Không tự ý leo trèo ngoài thang dẫn, Không làm việc khi thời tiết giông lốc, Không ném công cụ vật tư từ trên cao xuống",
      points: 20,
      explanation: "HSE nghiêm cấm việc leo trèo bám khung giàn giáo (phải dùng thang chuyển), làm việc trên cao khi gió lớn > cấp 5, hoặc ném rác xây dựng/vật phẩm từ trên cao xuống vì cực kỳ nguy hại."
    },
    {
      id: "c2_q2",
      type: "true-false",
      questionText: "Mũ bảo hộ công trường của Bách Việt có màu sắc phân biệt: Màu Trắng dành cho Kỹ sư/Quản lý và Màu Vàng dành cho Công nhân/Tổ đội.",
      options: ["Đúng", "Sai"],
      correctAnswer: "Đúng",
      points: 15,
      explanation: "Đúng! Quy chuẩn phân màu mũ bảo hộ giúp phân định phân vai nhanh trên công trường để chỉ huy thi công và cứu hộ ứng phó kịp thời."
    },
    {
      id: "c2_q3",
      type: "multiple-choice",
      questionText: "Khi phát hiện một thiết bị điện tại công trường bị rò rỉ hoặc dây dẫn điện bị bong tróc vỏ cách điện, hành động đúng nhất là gì?",
      options: [
        "Dùng băng dính đen tự dán lại và tiếp tục thi công",
        "Tránh xa vùng rò rỉ, ngắt nguồn điện tổng lập tức (nếu có thể) và báo ngay cho Giám sát HSE/Đội Cơ điện",
        "Lờ đi vì đó không phải là việc thuộc chuyên môn của mình",
        "Chờ đến cuối ca làm việc mới ghi vào sổ nhật ký"
      ],
      correctAnswer: "Tránh xa vùng rò rỉ, ngắt nguồn điện tổng lập tức (nếu có thể) và báo ngay cho Giám sát HSE/Đội Cơ điện",
      points: 25,
      explanation: "An toàn điện là ưu tiên hàng đầu. Tự xử lý không đúng kỹ thuật hoặc bỏ qua có thể dẫn đến tai nạn giật điện nghiêm trọng."
    },
    {
      id: "c2_q4",
      type: "gap-fill",
      questionText: "Tất cả cán bộ khi bước vào công trường phải mang đầy đủ... và mặc... phản quang.",
      options: ["Mũ bảo hộ", "Áo", "Kính râm", "Điện thoại", "Thắt lưng", "Găng tay len"],
      correctAnswer: ["Mũ bảo hộ", "Áo"],
      points: 20,
      explanation: "Mũ bảo hộ bảo vệ đầu khỏi dị vật rơi rớt và Áo phản quang giúp tăng khả năng nhận diện vị trí người lao động trong tối hoặc khu vực mù của máy xúc."
    },
    {
      id: "c2_q5",
      type: "matching",
      questionText: "Ghép các loại bình chữa cháy phổ biến tại công trường với công dụng tối ưu nhất:",
      pairs: [
        { left: "Bình chữa cháy CO2 (Ký hiệu MT)", right: "Dập đám cháy thiết bị điện, vi mạch, tủ cáp điện" },
        { left: "Bình dạng Bột (Ký hiệu MFZ)", right: "Dập đám cháy chất lỏng như xăng, dầu và chất rắn dễ cháy" }
      ],
      correctAnswer: {
        "Bình chữa cháy CO2 (Ký hiệu MT)": "Dập đám cháy thiết bị điện, vi mạch, tủ cáp điện",
        "Bình dạng Bột (Ký hiệu MFZ)": "Dập đám cháy chất lỏng như xăng, dầu và chất rắn dễ cháy"
      },
      points: 20,
      explanation: "Sử dụng đúng chủng loại bình cứu hỏa tránh làm hỏng thiết bị kỹ thuật nặng và tăng hiệu năng dập đám cháy."
    }
  ]
};

const technicalSiteLesson: LessonNode = {
  id: 3,
  title: "Kỹ Thuật Thi Công & Quản Lý Công Trường",
  description: "Các quy chuẩn kỹ thuật bê tông, nghiệm thu cốt thép cốp pha và lập nhật ký công trường Bách Việt.",
  category: "technical" as LessonCategory,
  xpReward: 150,
  questions: [
    {
      id: "c3_se_q1",
      type: "multiple-choice",
      questionText: "Theo tiêu chuẩn thi công Bách Việt, thời gian bảo dưỡng ẩm tự nhiên cho bê tông thường tối thiểu là bao nhiêu ngày?",
      options: [
        "Chỉ cần bảo dưỡng trong 1 ngày đầu tiên",
        "Tối thiểu từ 7 ngày liên tục với tần suất tưới nước thích hợp",
        "Phải bảo dưỡng đủ 28 ngày mới được làm việc tiếp",
        "Không cần tưới nước nếu trời mát ẩm"
      ],
      correctAnswer: "Tối thiểu từ 7 ngày liên tục với tần suất tưới nước thích hợp",
      points: 25,
      explanation: "Theo TCVN 5574, tốc độ phát triển cường độ bê tông phụ thuộc lớn vào việc bảo dưỡng ẩm trong 7 ngày đầu để tránh nứt nẻ và co ngót thể tích."
    },
    {
      id: "c3_se_q2",
      type: "true-false",
      questionText: "Nhật ký công trường phải được Kỹ sư viết tay hoặc cập nhật lên app BV-Pro hàng ngày sau khi kết thúc ca, không được gộp nhiều ngày viết một lần.",
      options: ["Đúng", "Sai"],
      correctAnswer: "Đúng",
      points: 15,
      explanation: "Đúng! Nhật ký thi công là hồ sơ pháp lý tối quan trọng phục vụ hoàn công và thanh quyết toán dự án, bắt buộc cập nhật hàng ngày trung thực."
    },
    {
      id: "c3_se_q3",
      type: "gap-fill",
      questionText: "Trước khi đổ bê tông, Kỹ sư giám sát phải nghiệm thu cấu kiện... và độ kín khít của... dầm sàn.",
      options: ["Cốt thép", "Cốp pha", "Vữa hồ", "Sợi cáp", "Giàn giáo", "Dầu nhờn"],
      correctAnswer: ["Cốt thép", "Cốp pha"],
      points: 30,
      explanation: "Sắt thép phải đúng kích cỡ, khoảng cách và sạch rỉ. Cốp pha phải kín kẽ không để chảy mất nước xi măng làm rỗ bê tông."
    }
  ]
};

const technicalArchLesson: LessonNode = {
  id: 3,
  title: "Quy Chuẩn Thiết Kế & Quy Trình BIM",
  description: "Phương pháp áp dụng mô hình BIM (Building Information Modeling) và kiểm soát va chạm kết cấu kiến trúc.",
  category: "technical" as LessonCategory,
  xpReward: 150,
  questions: [
    {
      id: "c3_ar_q1",
      type: "multiple-choice",
      questionText: "Cập độ phân phối BIM mà Bách Việt đang áp dụng đồng bộ cho các dự án thầu từ năm 2025 là gì?",
      options: [
        "BIM Level 1 (2D & 3D riêng rẽ)",
        "BIM Level 2 (Cộng tác thông qua các định dạng tệp chuẩn hóa như IFC)",
        "Chỉ thiết kế AutoCad 2D truyền thống",
        "Sử dụng AI tự động hóa hoàn toàn thiết kế"
      ],
      correctAnswer: "BIM Level 2 (Cộng tác thông qua các định dạng tệp chuẩn hóa như IFC)",
      points: 25,
      explanation: "Bách Việt áp dụng BIM Level 2 để tối ưu hóa sự phối hợp đa bộ môn (Kiến trúc - Kết cấu - Cơ điện MEP), giảm thiểu xung đột bản vẽ."
    },
    {
      id: "c3_ar_q2",
      type: "true-false",
      questionText: "Thiết kế kiến trúc của Bách Việt bắt buộc phải vượt qua khâu thẩm duyệt 'Clash Detection' (Kiểm tra va chạm) trước khi xuất bản vẽ thi công chính thức.",
      options: ["Đúng", "Sai"],
      correctAnswer: "Đúng",
      points: 15,
      explanation: "Kiểm tra va chạm trên mô hình 3D (ví dụ giữa dầm kết cấu và ống thông gió MEP) giúp tránh các lỗi đục đẽo chỉnh sửa đắt đỏ ngoài công trường."
    },
    {
      id: "c3_ar_q3",
      type: "gap-fill",
      questionText: "Bản vẽ thiết kế thuộc giai đoạn thi công thực tế tại công trường được gọi là bản vẽ... hay còn gọi là Shop...",
      options: ["Triển khai", "Drawing", "Kiến trúc", "3D Max", "Hoàn công", "Sơ khai"],
      correctAnswer: ["Triển khai", "Drawing"],
      points: 30,
      explanation: "Bản vẽ Shop Drawing là bản vẽ thi công chi tiết được chiết xuất từ thiết kế kỹ thuật, do nhà thầu lập để công nhân trực tiếp thi công."
    }
  ]
};

const technicalPmLesson: LessonNode = {
  id: 3,
  title: "Quản Trị Dự Án & Quy Trình Khớp Nối Phòng Ban",
  description: "Cách điều phối nguồn lực, quy trình phê duyệt đấu thầu và hồ sơ nghiệm thu thanh toán.",
  category: "management" as LessonCategory,
  xpReward: 150,
  questions: [
    {
      id: "c3_pm_q1",
      type: "multiple-choice",
      questionText: "Quy trình thanh toán khối lượng hoàn thành định kỳ cho Nhà thầu phụ tại Bách Việt cần thông tin phê duyệt từ những ai?",
      options: [
        "Chỉ cần bảo vệ công trường xác nhận",
        "Kỹ sư giám sát -> Chỉ huy trưởng -> Ban Kiểm soát QA/QC -> Ban Tổng giám đốc phê duyệt cuối",
        "Chỉ cần phòng kế toán tự động chuyển khoản",
        "Do thầu phụ tự tính toán và xuất hóa đơn trực tiếp"
      ],
      correctAnswer: "Kỹ sư giám sát -> Chỉ huy trưởng -> Ban Kiểm soát QA/QC -> Ban Tổng giám đốc phê duyệt cuối",
      points: 25,
      explanation: "Quy trình nhiều lớp nhằm đảm bảo khối lượng công việc thực tế được nghiệm thu kỹ lưỡng, minh bạch tài chính dự án."
    },
    {
      id: "c3_pm_q2",
      type: "true-false",
      questionText: "Hồ sơ RFI (Yêu cầu làm rõ thông tin bản vẽ) có thể gửi bằng lời nói điện thoại trực tiếp mà không cần làm biên bản văn bản chính thức.",
      options: ["Đúng", "Sai"],
      correctAnswer: "Sai",
      points: 15,
      explanation: "Mọi RFI phải được lập thành văn bản giấy hoặc phiếu điện tử hệ thống để lưu trữ lịch sử phản hồi kỹ thuật, tránh tranh chấp phát sinh."
    },
    {
      id: "c3_pm_q3",
      type: "gap-fill",
      questionText: "Tiến độ tổng thể của dự án được quản lý bằng các dốc mốc chính gọi là..., và tối ưu hóa bằng sơ đồ...",
      options: ["Milestones", "Gantt", "Hạn định", "Biểu mẫu", "Excel", "Mạng dây"],
      correctAnswer: ["Milestones", "Gantt"],
      points: 30,
      explanation: "Sơ đồ Gantt giúp trực quan hóa kế hoạch thi công trực tuyến và quản lý rủi ro trễ các mốc Milestones nghiêm trọng của dự án."
    }
  ]
};

const materialsLesson: LessonNode = {
  id: 4,
  title: "Quy Trình Công Vụ & Vật Tư Thiết Bị",
  description: "Nắm vững quy trình quản lý hao hụt vật liệu ximăng, sắt thép và đề xuất cơ giới thiết bị nặng.",
  category: "materials" as LessonCategory,
  xpReward: 130,
  questions: [
    {
      id: "c4_q1",
      type: "multiple-choice",
      questionText: "Khi muốn đề xuất xuất kho thép hoặc cát đá cho ca thi công hôm sau, kỹ sư phụ trách phải gửi Phiếu Đề Xuất Vật Tư tối thiểu bao lâu?",
      options: [
        "Sát giờ làm mới gọi thủ kho lấy",
        "Tối thiểu trước 24 giờ để Thủ kho sắp xếp bãi vật liệu và Ban Chỉ huy duyệt khối lượng",
        "Cứ tự tiện ra bãi xúc đem đi thi công",
        "Chờ đến cuối tuần đề xuất một thể"
      ],
      correctAnswer: "Tối thiểu trước 24 giờ để Thủ kho sắp xếp bãi vật liệu và Ban Chỉ huy duyệt khối lượng",
      points: 20,
      explanation: "Thời gian 24 giờ đảm bảo khâu logistics công trường điều vận mượt mà, hạn chế lãng phí thiết bị cơ giới chờ đợi."
    },
    {
      id: "c4_q2",
      type: "true-false",
      questionText: "Mức hao hụt vật tư cho phép tại Bách Việt được áp dụng đồng mức tuyệt đối 0% cho tất cả các loại vật liệu bao gồm cả gạch vữa và sắt thép.",
      options: ["Đúng", "Sai"],
      correctAnswer: "Sai",
      points: 15,
      explanation: "Mỗi loại vật liệu xây dựng đều được áp định mức hao hụt định mức kỹ thuật riêng (ví dụ hao hụt cắt thép hình khác gạch xây), không thể áp 0% phi thực tế."
    },
    {
      id: "c4_q3",
      type: "multiple-choice",
      questionText: "Thiết bị cẩu tháp, máy vận thăng lồng tại công trường Bách Việt trước khi đưa vào vận hành bắt buộc phải có giấy tờ pháp lý gì?",
      options: [
        "Kiểm định an toàn còn hiệu lực & Chứng chỉ vận hành của thợ lái cẩu",
        "Chỉ cần hợp đồng thuê máy mua bán",
        "Hóa đơn đỏ mua thiết bị chính hãng",
        "Ảnh chụp nghiệm thu ngoại quan bằng mắt thường"
      ],
      correctAnswer: "Kiểm định an toàn còn hiệu lực & Chứng chỉ vận hành của thợ lái cẩu",
      points: 25,
      explanation: "Thiết bị nâng hạ cực kỳ nguy hiểm nếu gặp sự cố. Bắt buộc kiểm định kỹ thuật nghiêm ngặt và người điều khiển có tay nghề bài bản."
    },
    {
      id: "c4_q4",
      type: "gap-fill",
      questionText: "Việc rà soát khối lượng thanh toán vật tư thực tế so với định mức dự toán được gọi là đối chiếu... và quyết...",
      options: ["Cân đối", "Toán", "Hàng hóa", "Bàn giao", "Biên bản", "Phòng ban"],
      correctAnswer: ["Cân đối", "Toán"],
      points: 20,
      explanation: "Sự khớp nối giữa Ban Chỉ Huy và Phòng Vật Tư giúp đảm bảo không thất thoát dòng tiền, không thất thoát vật liệu một cách bất thường."
    }
  ]
};

const finalChallengeLesson: LessonNode = {
  id: 5,
  title: "Chính Phục Đỉnh Cao: Đại Thử Thách Bách Việt",
  description: "Bài kiểm tra sát hạch cuối cùng tổng hợp mọi kiến thức để đủ điều kiện cấp Thẻ Hội Nhập vinh danh nhân viên ưu tú.",
  category: "management" as LessonCategory,
  xpReward: 200,
  questions: [
    {
      id: "c5_q1",
      type: "multiple-choice",
      questionText: "Gặp tình huống ý kiến bất đồng lớn về tiến độ thi công giữa Kỹ sư Giám sát của Bách Việt và tư vấn giám sát Chủ Đầu Tư, phương án xử lý chuyên nghiệp nhất là gì?",
      options: [
        "Tranh cãi trực tiếp gay gắt ngay ngoài thực địa để bảo vệ lẽ phải",
        "Ngừng thi công vô thời hạn để phản đối",
        "Tổng hợp dữ liệu thực tế, lập biên bản ghi nhận hiện trạng kỹ thuật và tổ chức buổi họp tìm tiếng nói chung có chứng kiến của Chỉ huy trưởng",
        "Ký bừa vào biên bản chấp thuận theo ý Chủ Đầu Tư để giữ quan hệ hòa hảo"
      ],
      correctAnswer: "Tổng hợp dữ liệu thực tế, lập biên bản ghi nhận hiện trạng kỹ thuật và tổ chức buổi họp tìm tiếng nói chung có chứng kiến của Chỉ huy trưởng",
      points: 30,
      explanation: "Tính chuyên nghiệp của người Bách Việt dựa trên số liệu thực tế, tôn trọng đối tác và tinh thần giải quyết vấn đề hiệu quả nhất cho tiến độ dự án."
    },
    {
      id: "c5_q2",
      type: "true-false",
      questionText: "Sau khi hoàn thành đợt sát hạch 5 Module này và đạt KPI, nhân viên mới sẽ chính thức nhận Chứng nhận Điện tử từ Bách Việt Academy để hoàn tất thủ tục thử việc.",
      options: ["Đúng", "Sai"],
      correctAnswer: "Đúng",
      points: 20,
      explanation: "Chính xác! Hệ thống liên thông trực tiếp với Ban Nhân Sự để đánh giá điểm số đầu vào của bạn trước thời hạn kết kết hợp đồng chính thức."
    },
    {
      id: "c5_q3",
      type: "multiple-choice",
      questionText: "Đâu là 'Sứ mệnh chiến lược' thúc đẩy sự phát triển của Bách Việt trong kỷ nguyên số?",
      options: [
        "Trở thành tổng thầu xây lắp dẫn đầu nhờ chuyển đổi xanh, bê tông phát thải thấp và an toàn tuyệt hảo",
        "Mở rộng sang các lĩnh vực bán lẻ và thời trang nhanh cá tính",
        "Mua thêm nhiều phương tiện hạng sang cho ban giám đốc",
        "Hạn chế tăng trưởng quy mô để tránh rủi ro quản lý"
      ],
      correctAnswer: "Trở thành tổng thầu xây lắp dẫn đầu nhờ chuyển đổi xanh, bê tông phát thải thấp và an toàn tuyệt hảo",
      points: 30,
      explanation: "Bách Việt hướng tới xây dựng bền vững, công nghệ tiên tiến kết hợp hài hòa giữa phát triển kinh tế và trách nhiệm với môi trường sống."
    }
  ]
};

// Help statistics or fact cards to be displayed in details
export const handbooks = [
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

export const getLessonsForRole = (role: Role): LessonNode[] => {
  let specializedLesson = technicalSiteLesson;
  if (role === 'architect') {
    specializedLesson = technicalArchLesson;
  } else if (role === 'pm-admin') {
    specializedLesson = technicalPmLesson;
  }

  return [
    cultureLesson,
    safetyLesson,
    specializedLesson,
    materialsLesson,
    finalChallengeLesson
  ];
};
