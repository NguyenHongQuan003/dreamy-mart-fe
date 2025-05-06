import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, InputNumber, DatePicker, Switch, Button, message } from "antd";
import AdminNavbar from "./AdminNavbar";
import { createPromotion } from "../../services/promotionService";

const AddPromotion = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            console.log('Form values:', values);
            const promotionData = {
                ...values,
                startDate: values.startDate.toISOString(),
                endDate: values.endDate.toISOString(),
                discountPercent: values.discountPercent || 0,
                discountAmount: values.discountAmount || 0,
            };
            console.log('Promotion data:', promotionData);

            await createPromotion(promotionData);
            message.success("Thêm khuyến mãi thành công!");
            navigate("/admin/promotions");
        } catch (error) {
            message.error("Có lỗi xảy ra khi thêm khuyến mãi!");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <AdminNavbar />
            <div className="flex-1 p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Thêm khuyến mãi mới</h1>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            isActive: true,
                            isGlobal: true,
                            discountPercent: 0,
                            discountAmount: 0,
                        }}
                    >
                        <Form.Item
                            name="promotionName"
                            label="Tên khuyến mãi"
                            rules={[{ required: true, message: "Vui lòng nhập tên khuyến mãi!" }]}
                        >
                            <Input placeholder="Nhập tên khuyến mãi" />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                        >
                            <Input.TextArea rows={4} placeholder="Nhập mô tả khuyến mãi" />
                        </Form.Item>

                        <Form.Item
                            name="couponCode"
                            label="Mã khuyến mãi"
                            rules={[{ required: true, message: "Vui lòng nhập mã khuyến mãi!" }]}
                        >
                            <Input placeholder="Nhập mã khuyến mãi" />
                        </Form.Item>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item
                                name="discountPercent"
                                label="Tỷ lệ giảm giá (%)"
                            >
                                <InputNumber
                                    min={0}
                                    max={100}
                                    style={{ width: "100%" }}
                                    placeholder="Nhập tỷ lệ giảm giá"
                                />
                            </Form.Item>

                            <Form.Item
                                name="discountAmount"
                                label="Số tiền giảm (VNĐ)"
                            >
                                <InputNumber
                                    min={0}
                                    style={{ width: "100%" }}
                                    placeholder="Nhập số tiền giảm"
                                />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="minimumOrderValue"
                            label="Giá trị đơn hàng tối thiểu (VNĐ)"
                            rules={[{ required: true, message: "Vui lòng nhập giá trị đơn hàng tối thiểu!" }]}
                        >
                            <InputNumber
                                min={0}
                                style={{ width: "100%" }}
                                placeholder="Nhập giá trị đơn hàng tối thiểu"
                            />
                        </Form.Item>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item
                                name="startDate"
                                label="Ngày bắt đầu"
                                rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
                            >
                                <DatePicker
                                    showTime
                                    format="DD/MM/YYYY HH:mm"
                                    style={{ width: "100%" }}
                                    placeholder="Chọn ngày bắt đầu"
                                />
                            </Form.Item>

                            <Form.Item
                                name="endDate"
                                label="Ngày kết thúc"
                                rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc!" }]}
                            >
                                <DatePicker
                                    showTime
                                    format="DD/MM/YYYY HH:mm"
                                    style={{ width: "100%" }}
                                    placeholder="Chọn ngày kết thúc"
                                />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="isGlobal"
                            label="Phạm vi áp dụng"
                            valuePropName="checked"
                        >
                            <Switch checkedChildren="Toàn bộ" unCheckedChildren="Cá nhân" />
                        </Form.Item>


                        <Form.Item
                            name="isActive"
                            label="Trạng thái"
                            valuePropName="checked"
                        >
                            <Switch checkedChildren="Hoạt động" unCheckedChildren="Không hoạt động" />
                        </Form.Item>

                        <Form.Item>
                            <div className="flex justify-end gap-4">
                                <Button onClick={() => navigate("/admin/promotions")}>
                                    Hủy
                                </Button>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Thêm khuyến mãi
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default AddPromotion; 