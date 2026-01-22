import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

interface Props {
  size?: number;
}

const UserAvatar = ({ size = 36 }: Props) => {
  const auth = useContext(AuthContext);
  if (!auth || !auth.user) return null;

  const { user } = auth;

  // fallback: first letter
  if (!user.avatar) {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-full bg-red-600 flex items-center justify-center text-white font-semibold"
      >
        {user.name.charAt(0).toUpperCase()}
      </div>
    );
  }

  // helper to resolve URL
  const getAvatarUrl = (path: string) => {
    if (path.startsWith("http")) return path;
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    // strip /api if present to get server root for uploads
    const serverRoot = baseUrl.replace(/\/api$/, "");
    return `${serverRoot}${path}`;
  };

  return (
    <img
      src={getAvatarUrl(user.avatar)}
      alt="avatar"
      style={{ width: size, height: size }}
      className="rounded-full object-cover"
    />
  );
};

export default UserAvatar;
