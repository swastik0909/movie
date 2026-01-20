import { useContext, useState } from "react";
import { AuthContext } from "@/context/AuthContext";

const PRESET_AVATARS = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png",
];

const Profile = () => {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("Auth missing");

  const { user, updateName, updateAvatar } = auth;

  const [name, setName] = useState(user?.name || "");
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string>(
    user?.avatar
      ? `http://localhost:5000${user.avatar}`
      : "/avatar.png"
  );

  if (!user) return null;

  /* ================= PRESET AVATAR HANDLER ================= */
  const selectPresetAvatar = async (src: string) => {
    const response = await fetch(src);
    const blob = await response.blob();

    const file = new File([blob], "avatar.png", {
      type: blob.type,
    });

    setPreviewAvatar(src);
    updateAvatar(file);
    setShowAvatarModal(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-20 px-4 text-white">
      <div className="bg-[#121212] p-6 rounded-xl shadow-lg space-y-6">

        {/* ================= PROFILE HEADER ================= */}
        <div className="flex items-center gap-6">
          <img
            src={previewAvatar}
            className="w-24 h-24 rounded-full object-cover border border-gray-700"
          />

          <div>
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-sm text-gray-400">{user.email}</p>

            <button
              onClick={() => setShowAvatarModal(true)}
              className="mt-2 px-4 py-1 text-sm rounded bg-zinc-800 hover:bg-zinc-700"
            >
              Change Avatar
            </button>
          </div>
        </div>

        {/* ================= NAME ================= */}
        <div>
          <label className="text-sm text-gray-400">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 p-2 rounded bg-black border border-gray-700 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* ================= EMAIL ================= */}
        <div>
          <label className="text-sm text-gray-400">Email</label>
          <input
            value={user.email}
            disabled
            className="w-full mt-1 p-2 rounded bg-zinc-900 border border-gray-700 opacity-70"
          />
        </div>

        {/* ================= ACTIONS ================= */}
        <div>
          <button
            onClick={() => updateName(name)}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded font-semibold"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* ================= AVATAR MODAL ================= */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#121212] p-6 rounded-xl w-[380px]">
            <h2 className="text-lg font-semibold mb-4">
              Choose an Avatar
            </h2>

            <div className="grid grid-cols-4 gap-4">
              {PRESET_AVATARS.map((src) => (
                <img
                  key={src}
                  src={src}
                  onClick={() => selectPresetAvatar(src)}
                  className="w-16 h-16 rounded-full cursor-pointer border border-transparent hover:border-red-500"
                />
              ))}

              {/* Upload custom avatar */}
              <label className="w-16 h-16 rounded-full border border-gray-600 flex items-center justify-center cursor-pointer text-xl hover:border-red-500">
                +
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setPreviewAvatar(
                        URL.createObjectURL(e.target.files[0])
                      );
                      updateAvatar(e.target.files[0]);
                      setShowAvatarModal(false);
                    }
                  }}
                />
              </label>
            </div>

            <button
              className="mt-6 w-full py-2 bg-zinc-800 hover:bg-zinc-700 rounded"
              onClick={() => setShowAvatarModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
