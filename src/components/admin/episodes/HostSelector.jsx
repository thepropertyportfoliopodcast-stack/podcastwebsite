function HostGroup({ title, description, hosts, selected, onChange, guest = false }) {
  const values = Array.isArray(selected) ? selected : [];
  return (
    <fieldset className="rounded-xl border border-gray-800 bg-[#111] p-4 md:p-6">
      <legend className="px-2 text-lg font-semibold text-white">{title}</legend>
      <p className="mb-4 text-sm text-gray-400">{description}</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {hosts.map((host) => {
          const checked = values.includes(host.slug);
          return <label key={host.slug} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${checked ? "border-[#9747FF] bg-[#9747FF]/15" : "border-white/10 bg-white/5"}`}><input type="checkbox" checked={checked} onChange={() => onChange(checked ? values.filter((value) => value !== host.slug) : [...values, host.slug])} /><span className="font-medium text-white">{host.name}</span>{guest && <small className="ml-auto rounded-full bg-[#9747FF]/20 px-2 py-1 text-[#d8b7ff]">Guest</small>}</label>;
        })}
        {!hosts.length && <p className="text-sm text-gray-500">No profiles are available in this group.</p>}
      </div>
    </fieldset>
  );
}

export default function HostSelector({ hosts = [], selected = [], onChange, guestSelected = [], onGuestChange = () => {} }) {
  return <div className="space-y-6">
    <HostGroup title="Episode hosts" description="Select the regular hosts appearing in this episode." hosts={hosts.filter((host) => !host.isGuestOnly)} selected={selected} onChange={onChange} />
    <HostGroup title="Guest appearances" description="Select guest-only profiles appearing in this episode." hosts={hosts.filter((host) => host.isGuestOnly)} selected={guestSelected} onChange={onGuestChange} guest />
  </div>;
}
