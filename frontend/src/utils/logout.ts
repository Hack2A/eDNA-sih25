import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";

// Custom hook for logout functionality
export const useLogout = () => {
	const navigate = useNavigate();

	const logout = async () => {
		try {
			// Call the logout API (optional - depends on your backend implementation)
			await authService.logout();
		} catch (error) {
			console.error("Logout API error:", error);
		} finally {
			// Always clear the token from localStorage
			authService.clearToken();
			// Redirect to landing page
			navigate("/", { replace: true });
		}
	};

	return logout;
};

// Utility function for programmatic logout without hooks
export const logoutUser = () => {
	authService.clearToken();
	// For programmatic logout, you might need to manually navigate
	// or trigger a page reload to redirect to the landing page
	window.location.href = "/";
};
