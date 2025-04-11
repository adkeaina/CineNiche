import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pingAuth } from "../api/CineNicheAPI";
import Loading from "./Loading";

type Props = {
  children: JSX.Element;
  requiredRoles?: string[];
};

type AuthResponse = {
  isAuthenticated: boolean;
  roles: string[];
};

export default function AuthorizedView({ children, requiredRoles }: Props) {
  const [authInfo, setAuthInfo] = useState<AuthResponse | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await pingAuth();
        setAuthInfo(result);
      } catch (err) {
        navigate("/LoginPage", { replace: true });
      }
    };

    checkAuth();
  }, []);

  if (authInfo === null) return <Loading />;

  if (!authInfo.isAuthenticated) {
    return <div className="text-center mt-20">🚫 You must be logged in to access this page.</div>;
  }

  if (requiredRoles && !requiredRoles.some(role => authInfo.roles.includes(role))) {
    return <div className="text-center mt-20">⚠️ You do not have permission to view this page.</div>;
  }

  return children;
}
