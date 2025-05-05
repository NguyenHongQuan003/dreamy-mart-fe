import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const useCheckAdminAuth = (user) => {
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) {
            navigate("/admin/login");
        }
        if (user && !localStorage.getItem("roles").includes("ADMIN")) {
            navigate("/admin/login");
        }
    }, [user, navigate]);
}

export default useCheckAdminAuth