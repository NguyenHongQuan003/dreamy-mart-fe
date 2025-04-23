import { useEffect, useState } from 'react';
import Input from '../common/Input';
import PropTypes from 'prop-types';
import { getAddressUser } from '../../services/addressService';

const ShippingForm = ({ handleInputChange, errors, shippingInfo }) => {

    const [addressShipping, setAddressShipping] = useState([]);
    useEffect(() => {
        const fetchAddressList = async () => {
            try {
                const response = await getAddressUser();
                console.log("response address list", response);
                setAddressShipping(response);
            } catch (error) {
                console.log("Error fetching address list:", error);
            }
        }
        fetchAddressList();
    }, []);

    const handleAddressSelect = (e) => {
        const selectedId = parseInt(e.target.value);
        const selected = addressShipping.find(addr => addr.id === selectedId);
        if (selected) {
            const fullAddress = `${selected.street}, ${selected.district}, ${selected.city}`;
            handleInputChange({ target: { name: "address", value: fullAddress } });
        }
    };


    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-200">
                Thông tin giao hàng
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <Input
                        label="Họ và tên"
                        type="text"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleInputChange}
                        placeholder="Nguyễn Văn A"
                        required
                        disabled={true}
                        error={errors.fullName}
                    />
                </div>

                <div>
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        placeholder="example@gmail.com"
                        required
                        disabled={true}
                        error={errors.email}
                    />
                </div>

                <div>
                    <Input
                        label="Số điện thoại"
                        type="tel"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleInputChange}
                        placeholder="0123456789"
                        required
                        disabled={true}
                        error={errors.phone}
                    />
                </div>

                <div className='col-span-2'>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                        Chọn địa chỉ
                    </label>
                    <select
                        onChange={handleAddressSelect}
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                        defaultValue=""
                    >
                        <option value="" disabled>-- Chọn địa chỉ --</option>
                        {addressShipping.map(addr => (
                            <option key={addr.id} value={addr.id}>
                                {`${addr.street}, ${addr.district}, ${addr.city}`}
                            </option>
                        ))}
                    </select>
                    {errors.address && (
                        <p className="mt-2 text-red-500 text-sm">
                            {errors.address}
                        </p>
                    )}
                </div>


                <div className="md:col-span-2">
                    <Input
                        label="Ghi chú đơn hàng (tùy chọn)"
                        type="textarea"
                        name="notes"
                        value={shippingInfo.notes}
                        onChange={handleInputChange}
                        placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                    />
                </div>
            </div>
        </div>
    );
}

ShippingForm.propTypes = {
    handleInputChange: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    shippingInfo: PropTypes.object.isRequired,
};

export default ShippingForm