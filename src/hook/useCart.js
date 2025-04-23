import { useEffect } from "react";
import { fetchCartItems } from "../redux/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const useCart = () => {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            dispatch(fetchCartItems());
        }
    }, [dispatch, user]);

}

export default useCart;
