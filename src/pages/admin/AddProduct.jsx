import { useEffect, useState } from "react";
import { Form, Input, InputNumber, Upload, message, Select, Divider } from "antd";
import { PlusOutlined, SaveOutlined, RollbackOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../services/productService";
import AdminNavbar from "./AdminNavbar";
import { getCategories } from "../../services/categoryService";

const { TextArea } = Input;

const AddProduct = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    // const [categories, setCategories] = useState([
    //     { value: "Phone", label: "Điện thoại" },
    //     { value: "Laptop", label: "Laptop" },
    //     { value: "Tablet", label: "Máy tính bảng" },
    //     { value: "Accessories", label: "Phụ kiện" }
    // ]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await getCategories();
            console.log("Fetched categories:", response);
            setCategories(response);
        } catch (error) {
            console.error("Failed to fetch categories", error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCategories();
    }, []);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const files = fileList.map(file => file.originFileObj);
            await createProduct(values, files);
            message.success("Thêm sản phẩm thành công!");
            navigate("/admin/products");
        } catch (error) {
            if (error.response?.data?.message) {
                message.error(error.response.data.message);
            } else {
                message.error("Có lỗi xảy ra khi thêm sản phẩm!");
            }
        } finally {
            setLoading(false);
        }
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const handleCategoryChange = (value) => {
        if (value === "new") {
            const newCategory = prompt("Nhập tên danh mục mới:");
            if (newCategory) {
                const newCategoryValue = newCategory.replace(/\s+/g, '');
                setCategories([...categories, { id: newCategoryValue, name: newCategory }]);
                form.setFieldsValue({ categoryName: newCategoryValue });
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <AdminNavbar />
            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Thêm sản phẩm mới</h1>
                    <button
                        className="flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                        onClick={() => navigate("/admin/products")}
                    >
                        <RollbackOutlined className="mr-2" />
                        Quay lại
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Form.Item
                                    name="name"
                                    label={<span className="font-semibold text-gray-700">Tên sản phẩm</span>}
                                    rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
                                >
                                    <Input
                                        placeholder="Nhập tên sản phẩm"
                                        className="w-full h-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="categoryName"
                                    label={<span className="font-semibold text-gray-700">Danh mục</span>}
                                    rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
                                >
                                    <Select
                                        placeholder="Chọn danh mục"
                                        className="w-full"
                                        onChange={handleCategoryChange}
                                        dropdownRender={menu => (
                                            <>
                                                {menu}
                                                <Divider style={{ margin: '8px 0' }} />
                                                <div className="p-2">
                                                    <button
                                                        className="w-full text-left px-2 py-1 text-blue-600 hover:bg-blue-50 rounded flex items-center"
                                                        onClick={() => handleCategoryChange("new")}
                                                    >
                                                        <PlusOutlined className="mr-2" />
                                                        Thêm danh mục mới
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    >
                                        {categories.map(category => (
                                            <Select.Option key={category.id} value={category.name}>
                                                {category.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="brand"
                                    label={<span className="font-semibold text-gray-700">Thương hiệu</span>}
                                    rules={[{ required: true, message: "Vui lòng nhập thương hiệu!" }]}
                                >
                                    <Input
                                        placeholder="Nhập thương hiệu"
                                        className="w-full h-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    />
                                </Form.Item>
                            </div>

                            <div>
                                <Form.Item
                                    name="description"
                                    label={<span className="font-semibold text-gray-700">Mô tả</span>}
                                    rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                                >
                                    <TextArea
                                        rows={6}
                                        placeholder="Nhập mô tả sản phẩm"
                                        className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    />
                                </Form.Item>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 my-6"></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Form.Item
                                name="quantity"
                                label={<span className="font-semibold text-gray-700">Số lượng</span>}
                                rules={[{ required: true, message: "Vui lòng nhập số lượng!" }]}
                            >
                                <InputNumber
                                    min={0}
                                    className="w-full h-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    placeholder="Nhập số lượng"
                                />
                            </Form.Item>

                            <Form.Item
                                name="costPrice"
                                label={<span className="font-semibold text-gray-700">Giá gốc</span>}
                                rules={[{ required: true, message: "Vui lòng nhập giá gốc!" }]}
                            >
                                <InputNumber
                                    min={0}
                                    className="w-full h-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    placeholder="Nhập giá gốc"
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>

                            <Form.Item
                                name="sellingPrice"
                                label={<span className="font-semibold text-gray-700">Giá bán</span>}
                                rules={[{ required: true, message: "Vui lòng nhập giá bán!" }]}
                            >
                                <InputNumber
                                    min={0}
                                    className="w-full h-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                                    placeholder="Nhập giá bán"
                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </div>

                        <div className="border-t border-gray-200 my-6"></div>

                        <Form.Item
                            name="images"
                            label={<span className="font-semibold text-gray-700">Hình ảnh sản phẩm</span>}
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            rules={[{ required: true, message: "Vui lòng tải lên ít nhất một hình ảnh!" }]}
                        >
                            <Upload
                                listType="picture-card"
                                multiple
                                beforeUpload={() => false}
                                onChange={({ fileList }) => setFileList(fileList)}
                                className="custom-upload"
                            >
                                <div className="flex flex-col items-center justify-center">
                                    <PlusOutlined className="text-xl" />
                                    <div className="mt-2">Tải lên</div>
                                </div>
                            </Upload>
                        </Form.Item>

                        <Form.Item>
                            <div className="flex justify-end gap-4">
                                <button
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                                    onClick={() => navigate("/admin/products")}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors flex items-center"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="mr-2">Đang lưu...</span>
                                    ) : (
                                        <>
                                            <SaveOutlined className="mr-2" />
                                            Lưu sản phẩm
                                        </>
                                    )}
                                </button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default AddProduct; 