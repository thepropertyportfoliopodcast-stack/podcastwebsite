import Image from "next/image";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import PodcastApi from "@/services/podcastApi";
import { ADMIN_AVATARS, getAdminAvatarSource } from "@/data/adminAvatars";

export default function AdminAvatarPicker({ user, onUpdated }) {
  const api = useMemo(() => new PodcastApi(), []);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const currentSource = getAdminAvatarSource(user?.avatar);

  const choose = async (avatar) => {
    if (saving || avatar === user?.avatar) {
      setOpen(false);
      return;
    }
    setSaving(true);
    try {
      const response = await api.updateMyAvatar(avatar);
      onUpdated(response?.data?.data?.user || { ...user, avatar });
      setOpen(false);
      toast.success("Profile avatar updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to update avatar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-avatar-picker">
      <button type="button" className="admin-avatar-button" onClick={() => setOpen((value) => !value)} aria-label="Choose profile avatar" aria-expanded={open} title="Choose profile avatar">
        <Image src={currentSource} alt={`${user?.name || "Admin"} profile avatar`} width={44} height={44} />
      </button>
      {open && (
        <div className="admin-avatar-menu" role="dialog" aria-label="Choose profile avatar">
          <div className="admin-avatar-menu-heading">
            <strong>Profile avatar</strong>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close avatar picker">x</button>
          </div>
          <div className="admin-avatar-grid">
            {ADMIN_AVATARS.map(([fileName, source]) => (
              <button type="button" key={fileName} className={`admin-avatar-option ${user?.avatar === fileName ? "is-selected" : ""}`} onClick={() => choose(fileName)} disabled={saving} aria-label={`Choose ${fileName.replace(/\.svg$/, "").replace(/^\d+-/, "")}`} title={fileName.replace(/\.svg$/, "").replace(/^\d+-/, "")}>
                <Image src={source} alt="" width={42} height={42} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
