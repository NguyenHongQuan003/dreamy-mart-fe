import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import propTypes from "prop-types";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) {
            navigate("/login", { replace: true });
        }
    }, [user, navigate]);
    return children;
}

ProtectedRoute.propTypes = {
    children: propTypes.node.isRequired,
};

export default ProtectedRoute