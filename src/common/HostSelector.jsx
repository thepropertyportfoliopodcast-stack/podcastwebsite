export default function HostSelector({ hosts = [], selected = [], onChange }) {
  const values = Array.isArray(selected) ? selected : [];
  return (
    <fieldset className="rounded-xl border border-gray-800 bg-[#111] p-4 md:p-6">
      <legend className="px-2 text-lg font-semibold text-white">Episode hosts</legend>
      <p className="mb-4 text-sm text-gray-400">Select every host appearing in this episode.</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {hosts.map((host) => {
          const checked = values.includes(host.slug);
          return <label key={host.slug} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${checked ? "border-[#9747FF] bg-[#9747FF]/15" : "border-white/10 bg-white/5"}`}><input type="checkbox" checked={checked} onChange={() => onChange(checked ? values.filter((value) => value !== host.slug) : [...values, host.slug])} /><span className="font-medium text-white">{host.name}</span></label>;
        })}
      </div>
    </fieldset>
  );
}
