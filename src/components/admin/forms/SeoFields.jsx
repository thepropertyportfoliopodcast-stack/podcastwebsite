export default function SeoFields({ formData, onChange }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-[#111111] p-4 md:p-6 space-y-5">
      <div>
        <h4 className="text-lg font-semibold">Search Engine Optimisation</h4>
        <p className="mt-1 text-xs text-gray-400">
          Optional. If left blank, SEO values are generated from the title and description.
        </p>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">SEO title</label>
        <input
          type="text"
          name="seoTitle"
          maxLength={60}
          value={formData.seoTitle || ""}
          onChange={onChange}
          placeholder="Recommended: 50–60 characters"
          className="w-full p-3 rounded-lg bg-[#1c1c1c] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <p className="text-right text-xs text-gray-400">{(formData.seoTitle || "").length}/60</p>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium">Meta description</label>
        <textarea
          name="seoDescription"
          rows="3"
          maxLength={160}
          value={formData.seoDescription || ""}
          onChange={onChange}
          placeholder="Recommended: 140–160 characters"
          className="w-full p-3 rounded-lg bg-[#1c1c1c] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white resize-none"
        />
        <p className="text-right text-xs text-gray-400">{(formData.seoDescription || "").length}/160</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label className="block text-sm font-medium">Primary keyword</label>
          <input
            type="text"
            name="primaryKeyword"
            value={formData.primaryKeyword || ""}
            onChange={onChange}
            placeholder="e.g. Australian property market"
            className="w-full p-3 rounded-lg bg-[#1c1c1c] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Secondary keywords</label>
          <input
            type="text"
            name="secondaryKeywords"
            value={formData.secondaryKeywords || ""}
            onChange={onChange}
            placeholder="Comma-separated related phrases"
            className="w-full p-3 rounded-lg bg-[#1c1c1c] text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
      </div>
      <p className="text-xs text-gray-400">
        Use natural phrases relevant to the page. Avoid repeating or stuffing the same keyword.
      </p>
    </div>
  );
}
