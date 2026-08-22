export default function EpisodeRelationsFields({ formData, episodes = [], currentUuid, onChange }) {
  const selected = Array.isArray(formData.relatedEpisodeUuids) ? formData.relatedEpisodeUuids : [];
  const candidates = episodes.filter((episode) => episode.uuid !== currentUuid);
  const toggleRelated = (uuid) => {
    const next = selected.includes(uuid) ? selected.filter((item) => item !== uuid) : [...selected, uuid].slice(0, 4);
    onChange({ ...formData, relatedEpisodeUuids: next });
  };

  return <section className="space-y-5 rounded-xl border border-gray-800 bg-[#111] p-4 md:p-6">
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-700 bg-[#1c1c1c] p-4">
      <input type="checkbox" checked={Boolean(formData.isFeatured)} onChange={(event) => onChange({ ...formData, isFeatured: event.target.checked })} className="mt-1 h-5 w-5 accent-[#9747FF]" />
      <span><strong className="block">Featured homepage episode</strong><small className="text-gray-400">Featured episodes appear in the homepage carousel. The homepage displays the five most recently published featured episodes.</small></span>
    </label>
    <div>
      <h4 className="font-semibold">Related episodes <span className="text-sm font-normal text-gray-400">({selected.length}/4)</span></h4>
      <p className="mb-3 mt-1 text-xs text-gray-400">Select up to four episodes. They will appear in this order on the episode page.</p>
      <div className="max-h-72 space-y-2 overflow-y-auto pr-2">
        {candidates.map((episode) => <label key={episode.uuid} className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-700 bg-[#1c1c1c] p-3">
          <input type="checkbox" checked={selected.includes(episode.uuid)} disabled={!selected.includes(episode.uuid) && selected.length >= 4} onChange={() => toggleRelated(episode.uuid)} className="h-4 w-4 accent-[#9747FF]" />
          <span className="line-clamp-2 text-sm">{episode.title}</span>
        </label>)}
        {!candidates.length && <p className="text-sm text-gray-400">No other episodes are available yet.</p>}
      </div>
    </div>
  </section>;
}
