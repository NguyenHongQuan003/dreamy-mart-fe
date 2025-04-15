import { useEffect, useState } from 'react'
import { FaEdit, FaMapMarkerAlt, FaTrash } from 'react-icons/fa'
import { addAddressUser, deleteAddressUser, getAddressUser, updateAddressUser } from "../../services/addressService";
import Button from '../common/Button';
import Input from '../common/Input';

const Address = () => {
    const [addressList, setAddressList] = useState([]);
    const [formAddress, setFormAddress] = useState({
        id: "",
        street: "",
        city: "",
        district: "",
    });

    useEffect(() => {
        const fetchAddressList = async () => {
            try {
                const response = await getAddressUser();
                // console.log("response address list", response);
                setAddressList(response);
            } catch (error) {
                console.log("Error fetching address list:", error);
            }
        }
        fetchAddressList();
    }, [])

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormAddress((prev) => ({ ...prev, [name]: value }));
    }

    const handleInsertAddress = async () => {
        try {
            const response = await addAddressUser(formAddress);
            console.log("response add address", response);
            setAddressList((prev) => [...prev, response]);
            setFormAddress({
                street: "",
                city: "",
                district: "",
            });
        } catch (error) {
            console.log("Error adding address:", error);
        }
    }

    const handleDeleteAddress = async (id) => {
        try {
            const response = await deleteAddressUser(id);
            console.log("response delete address", response);
            setAddressList((prev) => prev.filter(address => address.id !== id));
        } catch (error) {
            console.log("Error deleting address:", error);
        }
    }

    const handleSaveAddress = async () => {
        try {
            const response = await updateAddressUser(formAddress);
            console.log("response update address", response);
            setAddressList((prev) => prev.map(address => address.id === formAddress.id ? response : address));
            setFormAddress({
                id: "",
                street: "",
                city: "",
                district: "",
            });
        } catch (error) {
            console.log("Error updating address:", error);
        }
    }

    const handleEditAddress = (address) => {
        setFormAddress({
            id: address.id,
            street: address.street,
            city: address.city,
            district: address.district,
        });
    }

    const renderAddressForm = () => {
        return (
            <div className="mt-4">
                <h3 className="text-xl font-bold">Thêm địa chỉ nhận hàng</h3>
                <div className="flex flex-col space-y-2">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Số nhà, tên đường</label>
                        <Input
                            type="text"
                            name="street"
                            value={formAddress.street}
                            onChange={handleAddressChange}
                            placeholder="Số nhà, tên đường"
                            className="border border-gray-300 rounded p-2"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Quận/Huyện</label>
                        <Input
                            type="text"
                            name="district"
                            value={formAddress.district}
                            onChange={handleAddressChange}
                            placeholder="Quận/Huyện"
                            className="border border-gray-300 rounded p-2"
                        /></div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Tỉnh/Thành phố</label>
                        <Input
                            type="text"
                            name="city"
                            value={formAddress.city}
                            onChange={handleAddressChange}
                            placeholder="Tỉnh/Thành phố"
                            className="border border-gray-300 rounded p-2"
                        />
                    </div>
                    {formAddress.id && (<Button type="submit" onClick={handleSaveAddress}>
                        Lưu chỉnh sửa
                    </Button>)}
                    <Button type="submit" onClick={handleInsertAddress}>
                        Thêm địa chỉ mới
                    </Button>
                </div>
            </div>
        )
    }


    //====================================================================
    return (
        <>
            <div className=''>
                {renderAddressForm()}
            </div>
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                    Địa chỉ nhận hàng
                </h2>
            </div>
            <div className="border border-[#0078E8] rounded-lg p-4 bg-gray-50">
                {addressList.map((address) => (
                    <div key={address.id} className="flex items-center justify-between border-b border-gray-300 py-2">
                        <div className="flex items-center">
                            <FaMapMarkerAlt className="text-[#0078E8] mr-2" />
                            <div>
                                <h3 className="text-lg font-semibold">{address.street}</h3>
                                <p>{address.district}, {address.city}</p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Button type="button" onClick={() => handleEditAddress(address)}>
                                <FaEdit />
                            </Button>
                            <Button type="button" className='bg-red-500' onClick={() => handleDeleteAddress(address.id)}>
                                <FaTrash />
                            </Button>
                        </div>
                    </div>
                ))}

                {/* Add Address Form */}
            </div>


        </>
    )
}

export default Address