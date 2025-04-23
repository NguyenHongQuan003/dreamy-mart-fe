import { Modal, Carousel, Image, Descriptions, Tag, Divider } from "antd";
import PropTypes from "prop-types";
const ProductDetailModal = ({ visible, onClose, product }) => {
    if (!product) return null;

    return (
        <Modal
            title="Chi tiết sản phẩm"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
            className="product-detail-modal"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Carousel autoplay>
                        {product.images.map((image) => (
                            <div key={image.id} className="h-80">
                                <Image
                                    src={image.fileUri}
                                    alt={image.fileName}
                                    className="w-full h-full object-contain"
                                    preview={true}
                                />
                            </div>
                        ))}
                    </Carousel>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
                    <Tag color="blue" className="mb-4">
                        {product.category.name}
                    </Tag>

                    <Divider />

                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="Nhóm sản phẩm">
                            <span className="font-mono">{product.category.name}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Mã sản phẩm">
                            <span className="font-mono">{product.id}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Thương hiệu">
                            <span className="font-medium">{product.brand}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Số lượng">
                            <span className="font-medium">{product.quantity}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Giá gốc">
                            <span className="font-medium text-red-600">
                                {product.costPrice.toLocaleString()} đ
                            </span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Giá bán">
                            <span className="font-medium text-green-600">
                                {product.sellingPrice.toLocaleString()} đ
                            </span>
                        </Descriptions.Item>
                    </Descriptions>

                    <Divider />

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Mô tả sản phẩm</h3>
                        <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

ProductDetailModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    product: PropTypes.object.isRequired,
};

export default ProductDetailModal; 