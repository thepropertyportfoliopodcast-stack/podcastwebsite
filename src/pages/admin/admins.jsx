import { useCallback, useEffect, useMemo, useState } from "react";
import { FaEdit, FaPlus, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import AdminLayout from "@/components/layout/AdminLayout";
import PodcastApi from "@/services/podcastApi";
import { ADMIN_SECTIONS } from "@/config/adminSections";

const empty = { name: "", email: "", password: "", role: "ADMIN", permissions: ADMIN_SECTIONS.map((section) => section.id), isActive: true };

export default function AdminUsersPage() {
  const api = useMemo(() => new PodcastApi(), []);
  const [users, setUsers] = useState([]); const [form, setForm] = useState(empty); const [editing, setEditing] = useState(null); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false);
  const load = useCallback(async () => { setLoading(true); try { const response = await api.AdminUsersGet(); setUsers(response?.data?.data?.users || []); } catch (error) { toast.error(error?.response?.data?.message || "Unable to load administrators"); } finally { setLoading(false); } }, [api]);
  useEffect(() => { load(); }, [load]);
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const togglePermission = (permission) => setForm((current) => ({ ...current, permissions: current.permissions.includes(permission) ? current.permissions.filter((item) => item !== permission) : [...current.permissions, permission] }));
  const reset = () => { setEditing(null); setForm(empty); };
  const edit = (user) => { setEditing(user); setForm({ name: user.name, email: user.email, password: "", role: user.role, permissions: user.permissions || [], isActive: user.isActive }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const submit = async (event) => {
    event.preventDefault(); setSaving(true);
    try {
      const payload = { name: form.name, email: form.email, role: form.role, permissions: form.role === "SUPER_ADMIN" ? [] : form.permissions, isActive: form.isActive, ...(form.password ? { password: form.password } : {}) };
      if (editing) await api.AdminUserUpdate(editing.id, payload); else await api.AdminUserCreate(payload);
      toast.success(editing ? "Administrator updated" : "Administrator created"); reset(); await load();
    } catch (error) { toast.error(error?.response?.data?.message || "Unable to save administrator"); }
    finally { setSaving(false); }
  };

  return <AdminLayout><div className="mx-auto max-w-6xl text-white">
    <header className="mb-8"><p className="text-sm font-black uppercase tracking-[.18em] text-[#c347ff]">Super admin only</p><h1 className="mt-2 text-3xl font-black">Administrators</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-gray-400">Create admins or super admins. Normal admins see and can call only the dashboard sections selected here; this Admins section is permanently hidden from them.</p></header>
    <form onSubmit={submit} className="mb-10 rounded-2xl border border-gray-700 bg-[#121212] p-5 md:p-7">
      <div className="mb-6 flex items-center justify-between"><h2 className="text-xl font-bold">{editing ? `Edit ${editing.name}` : "Create an administrator"}</h2>{editing && <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-lg border border-gray-600 px-3 py-2 text-sm"><FaTimes />Cancel</button>}</div>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">Name<input required value={form.name} onChange={(event) => update("name", event.target.value)} className="rounded-xl border border-gray-700 bg-[#1c1c1c] px-4 py-3" /></label>
        <label className="grid gap-2 text-sm font-semibold">Email<input required type="email" disabled={Boolean(editing)} value={form.email} onChange={(event) => update("email", event.target.value)} className="rounded-xl border border-gray-700 bg-[#1c1c1c] px-4 py-3 disabled:opacity-60" /></label>
        <label className="grid gap-2 text-sm font-semibold">Password {editing && <small className="font-normal text-gray-500">Leave blank to keep the current password.</small>}<input required={!editing} minLength="8" type="password" value={form.password} onChange={(event) => update("password", event.target.value)} className="rounded-xl border border-gray-700 bg-[#1c1c1c] px-4 py-3" /></label>
        <label className="grid gap-2 text-sm font-semibold">Role<select value={form.role} onChange={(event) => update("role", event.target.value)} className="rounded-xl border border-gray-700 bg-[#1c1c1c] px-4 py-3"><option value="ADMIN">Admin</option><option value="SUPER_ADMIN">Super admin</option></select></label>
      </div>
      <fieldset className="mt-6" disabled={form.role === "SUPER_ADMIN"}><legend className="font-bold">Accessible dashboard sections</legend><p className="mt-1 text-xs text-gray-400">Super admins always have every section and page. For a normal admin, unchecked sections are hidden and blocked by the API.</p><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{ADMIN_SECTIONS.map((section) => <label key={section.id} className="flex items-center gap-3 rounded-xl border border-gray-700 bg-[#1c1c1c] p-4"><input type="checkbox" checked={form.role === "SUPER_ADMIN" || form.permissions.includes(section.id)} onChange={() => togglePermission(section.id)} className="h-4 w-4 accent-[#c347ff]" /><span>{section.label}</span></label>)}</div></fieldset>
      <label className="mt-6 flex items-center gap-3"><input type="checkbox" checked={form.isActive} onChange={(event) => update("isActive", event.target.checked)} className="h-4 w-4 accent-[#c347ff]" />Account is active</label>
      <button disabled={saving} className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-[#8c2ed3] to-[#c347ff] px-7 font-bold disabled:opacity-60"><FaPlus />{saving ? "Saving…" : editing ? "Save administrator" : "Create administrator"}</button>
    </form>
    <section className="grid gap-4 md:grid-cols-2">{loading ? <p className="text-gray-400">Loading administrators…</p> : users.map((user) => <article key={user.id} className="rounded-2xl border border-gray-700 bg-[#121212] p-5"><div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-bold">{user.name}</h2><p className="text-sm text-gray-400">{user.email}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${user.role === "SUPER_ADMIN" ? "bg-purple-900 text-purple-100" : "bg-gray-800 text-gray-200"}`}>{user.role === "SUPER_ADMIN" ? "Super admin" : "Admin"}</span></div><p className="mt-4 text-xs text-gray-400">{user.role === "SUPER_ADMIN" ? "All dashboard sections" : user.permissions.length ? user.permissions.join(", ") : "No dashboard sections"} · {user.isActive ? "Active" : "Inactive"}</p><button type="button" onClick={() => edit(user)} className="mt-5 inline-flex items-center gap-2 rounded-lg border border-gray-600 px-4 py-2 text-sm font-bold"><FaEdit />Edit</button></article>)}</section>
  </div></AdminLayout>;
}
