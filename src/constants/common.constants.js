export const APP_INFO = {
  LOGO_MINI:
    "https://res.cloudinary.com/dclf0ngcu/image/upload/v1741185494/dreamy-mart/logo_dreamysmart_mini.png",
  LOGO: "https://res.cloudinary.com/dclf0ngcu/image/upload/v1741756264/dreamy-mart/Logo_component_njsvlu.png",
  NAME: "DreamyMart",
  TITLE: "DreamyMart - Cửa hàng trực tuyến",
  DESCRIPTION: "Mua sắm trực tuyến với giá tốt nhất",
  KEYWORDS: "ecommerce, online shopping, fashion, electronics",
};

export const BANNER = {
  SALE_BANNER:
    "https://res.cloudinary.com/dclf0ngcu/image/upload/v1741184004/dreamy-mart/banner_sales.png",
  MAIN_BANNER: [
    {
      id: 1,
      title: "Siêu Sale 3.3",
      description: "Giảm giá lên đến 50%",
      image: "https://example.com/banner1.jpg",
      link: "/promotion/sale-3-3",
    },
    {
      id: 2,
      title: "Mùa Xuân 2024",
      description: "Bộ sưu tập mới nhất",
      image: "https://example.com/banner2.jpg",
      link: "/promotion/spring-2024",
    },
  ],
  SUB_BANNER: [
    {
      id: 3,
      title: "Điện Thoại",
      image: "https://example.com/phone-banner.jpg",
      link: "/category/electronics/phones",
    },
    {
      id: 4,
      title: "Thời Trang",
      image: "https://example.com/fashion-banner.jpg",
      link: "/category/fashion",
    },
  ],
};

export const SOCIAL_LINKS = {
  FACEBOOK: "https://facebook.com/dreamymart",
  INSTAGRAM: "https://instagram.com/dreamymart",
  TWITTER: "https://twitter.com/dreamymart",
};

export const CONTACT_INFO = {
  PHONE: "1900 1234",
  EMAIL: "support@dreamymart.com",
  ADDRESS: "123 Đường ABC, Quận 1, TP.HCM",
};

export const STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  PENDING: "PENDING",
  DELETED: "DELETED",
};

// Các loại thông báo
export const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
  INFO: "info",
};

// Các giới hạn chung
export const LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGE_SIZE: 2 * 1024 * 1024, // 2MB
  ITEMS_PER_PAGE: 12,
  MAX_CART_ITEMS: 99,
};

// Các định dạng file được phép
export const ALLOWED_FILE_TYPES = {
  IMAGES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  DOCUMENTS: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

// Các thông báo lỗi chung
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: "Trường này là bắt buộc",
  INVALID_EMAIL: "Email không hợp lệ",
  INVALID_PHONE: "Số điện thoại không hợp lệ",
  INVALID_PASSWORD: "Mật khẩu phải có ít nhất 6 ký tự",
  FILE_TOO_LARGE: "File quá lớn",
  INVALID_FILE_TYPE: "Loại file không được hỗ trợ",
  NETWORK_ERROR: "Lỗi kết nối mạng",
  SERVER_ERROR: "Lỗi máy chủ",
};

// Các thông báo thành công chung
export const SUCCESS_MESSAGES = {
  CREATE_SUCCESS: "Tạo mới thành công",
  UPDATE_SUCCESS: "Cập nhật thành công",
  DELETE_SUCCESS: "Xóa thành công",
  LOGIN_SUCCESS: "Đăng nhập thành công",
  REGISTER_SUCCESS: "Đăng ký thành công",
  ADD_TO_CART_SUCCESS: "Thêm vào giỏ hàng thành công",
};

// Các cài đặt phân trang
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 36, 48],
};

// Các class Tailwind thường dùng
export const TAILWIND_CLASSES = {
  // Layout
  CONTAINER: "container mx-auto px-4",
  FLEX_CENTER: "flex items-center justify-center",
  FLEX_BETWEEN: "flex items-center justify-between",
  GRID: "grid grid-cols-1 gap-4",

  // Spacing
  PADDING: {
    SMALL: "p-2",
    MEDIUM: "p-4",
    LARGE: "p-6",
  },
  MARGIN: {
    SMALL: "m-2",
    MEDIUM: "m-4",
    LARGE: "m-6",
  },

  // Typography
  TEXT: {
    SMALL: "text-sm",
    MEDIUM: "text-base",
    LARGE: "text-lg",
    XLARGE: "text-xl",
    BOLD: "font-bold",
    SEMIBOLD: "font-semibold",
  },

  // Borders
  BORDER: {
    DEFAULT: "border border-gray-300",
    ROUNDED: "rounded-md",
    ROUNDED_FULL: "rounded-full",
  },

  // Shadows
  SHADOW: {
    SMALL: "shadow-sm",
    MEDIUM: "shadow-md",
    LARGE: "shadow-lg",
  },

  // Transitions
  TRANSITION: "transition-all duration-200",

  // Hover effects
  HOVER: {
    OPACITY: "hover:opacity-80",
    SCALE: "hover:scale-105",
    SHADOW: "hover:shadow-md",
  },
};
