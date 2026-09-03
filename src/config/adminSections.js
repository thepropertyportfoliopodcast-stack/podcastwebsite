export const ADMIN_SECTIONS = [
  { id: "dashboard", label: "Dashboard", href: "/admin" },
  { id: "analytics", label: "Analytics", href: "/admin/analytics" },
  { id: "podcasts", label: "Podcasts", href: "/admin/podcast" },
  { id: "transcripts", label: "Transcripts", href: "/admin/transcripts" },
  { id: "hosts", label: "Hosts", href: "/admin/host" },
  { id: "enquiries", label: "Enquiry", href: "/admin/enquiry" },
  { id: "subscribers", label: "Subscriber", href: "/admin/subscriber" },
];

export const hasSectionAccess = (user, section) => Boolean(user) && (user.role === "SUPER_ADMIN" || user.permissions?.includes(section));
export const firstAccessibleRoute = (user) => user?.role === "SUPER_ADMIN" ? "/admin" : ADMIN_SECTIONS.find((section) => hasSectionAccess(user, section.id))?.href || "/admin/login";

export function sectionForPath(pathname = "") {
  if (pathname === "/admin") return "dashboard";
  if (pathname.startsWith("/admin/analytics")) return "analytics";
  if (pathname.startsWith("/admin/ip-whitelist")) return "super_admin";
  if (pathname.startsWith("/admin/podcast") || pathname.startsWith("/admin/episode") || pathname.startsWith("/admin/hero-phones") || pathname.startsWith("/admin/guide")) return "podcasts";
  if (pathname.startsWith("/admin/transcripts")) return "transcripts";
  if (pathname.startsWith("/admin/host")) return "hosts";
  if (pathname.startsWith("/admin/enquiry")) return "enquiries";
  if (pathname.startsWith("/admin/subscriber")) return "subscribers";
  if (pathname.startsWith("/admin/admins")) return "super_admin";
  return null;
}
