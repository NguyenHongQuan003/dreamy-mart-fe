import { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import {
  FaUser,
  // FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  // FaEdit,
  // FaPlus,
} from "react-icons/fa";
import { useAuth } from "../utils/authUtils";

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: Implement update profile logic
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center">
                  <FaUser className="text-white text-3xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {user?.fullname || "Chưa cập nhật"}
                  </h1>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                // icon={<FaEdit />}
              >
                {isEditing ? "Hủy" : "Chỉnh sửa"}
              </Button>
            </div>
          </div>

          {/* Profile Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Họ và tên"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  disabled={!isEditing}
                  //   icon={<FaUser />}
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  //   icon={<FaEnvelope />}
                />
                <Input
                  label="Số điện thoại"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  //   icon={<FaPhone />}
                />
              </div>

              {/* Gender Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Giới tính
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="form-radio text-blue-600"
                    />
                    <span className="ml-2">Nam</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="form-radio text-blue-600"
                    />
                    <span className="ml-2">Nữ</span>
                  </label>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-4">
                  <Button type="submit" variant="primary" fullWidth>
                    Lưu thay đổi
                  </Button>
                </div>
              )}
            </form>
          </div>

          {/* Delivery Addresses */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Địa chỉ nhận hàng
              </h2>
              <Button
                variant="outline"
                //   icon={<FaPlus />}
              >
                Thêm địa chỉ mới
              </Button>
            </div>

            {/* Address List */}
            <div className="space-y-4">
              {/* Default Address */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <FaUser className="text-gray-600" />
                      <span className="font-medium">Nguyễn Văn A</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <FaPhone className="text-gray-600" />
                      <span>0123456789</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <FaMapMarkerAlt className="text-gray-600" />
                      <span>123 Đường ABC, Quận 1, TP.HCM</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Sửa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    Địa chỉ mặc định
                  </span>
                </div>
              </div>

              {/* Other Address */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <FaUser className="text-gray-600" />
                      <span className="font-medium">Nguyễn Văn B</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <FaPhone className="text-gray-600" />
                      <span>0987654321</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <FaMapMarkerAlt className="text-gray-600" />
                      <span>456 Đường XYZ, Quận 2, TP.HCM</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Sửa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
