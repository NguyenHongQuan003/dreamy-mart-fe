import { useEffect, useState } from "react";
import { Form, Input, InputNumber, Upload, message, Select, Divider } from "antd";
import { PlusOutlined, SaveOutlined, RollbackOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, updateProduct } from "../../services/productService";
import AdminNavbar from "./AdminNavbar";
import { getCategories } from "../../services/categoryService";

const { TextArea } = Input;

const ProductEdit = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams();
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                setCategories(response);
            } catch {
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const product = await getProductById(id);
                console.log(product);
                form.setFieldsValue({
                    name: product.name,
                    description: product.description,
                    brand: product.brand,
                    costPrice: product.costPrice,
                    sellingPrice: product.sellingPrice,
                    categoryName: product.category?.name,
                    quantity: product.quantity,
                });
                // Hiển thị tất cả hình ảnh hiện có
                if (product.images && product.images.length > 0) {
                    const existingImages = product.images.map((img, index) => ({
                        uid: `-${index + 1}`, // Tạo uid âm để phân biệt với ảnh mới
                        name: img.fileName || `Ảnh ${index + 1}`,
                        status: 'done',
                        url: img.fileUri,
                        thumbUrl: img.fileUri, // Thêm thumbUrl để hiển thị preview
                        originFileObj: null // Đánh dấu là ảnh cũ
                    }));
                    setFileList(existingImages);
                }
            } catch {
                message.error("Không lấy được thông tin sản phẩm!");
            }
        };
        fetchProduct();
    }, [id, form]);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            // Lấy file mới upload
            const files = fileList.filter(f => !f.url).map(f => f.originFileObj);
            // Lấy id ảnh cũ giữ lại
            const imageIds = fileList.filter(f => f.url && f.uid).map(f => f.uid);
            await updateProduct(id, { ...values, imageIds }, files);
            message.success("Cập nhật thành công!");
            navigate("/admin/products");
        } catch {
            message.error("Cập nhật thất bại!");
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
                    <h1 className="text-3xl font-bold text-gray-800">Chỉnh sửa sản phẩm</h1>
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
                            rules={[{ required: false }]}
                        >
                            <Upload
                                listType="picture-card"
                                multiple
                                beforeUpload={() => false}
                                fileList={fileList}
                                onChange={({ fileList }) => setFileList(fileList)}
                                className="custom-upload"
                                defaultFileList={[]}
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
                                    type="button"
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
                                            Lưu thay đổi
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

export default ProductEdit;