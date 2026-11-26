import React, { useMemo, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

const splitCategories = (value = "") => String(value)
  .split(",")
  .map((category) => category.trim())
  .filter(Boolean);

export default function CategoryTagInput({ value = "", onChange, existingEpisodes = [], disabled = false }) {
  const [draft, setDraft] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const categories = splitCategories(value);
  const suggestions = useMemo(() => {
    const unique = new Map();
    existingEpisodes.forEach((episode) => {
      const episodeCategories = [
        ...(Array.isArray(episode?.categories) ? episode.categories : []),
        ...splitCategories(episode?.topic || ""),
      ];
      episodeCategories.forEach((category) => {
        const key = category.toLocaleLowerCase();
        if (key && !unique.has(key)) unique.set(key, category);
      });
    });
    return [...unique.values()].filter((category) =>
      !categories.some((selected) => selected.toLocaleLowerCase() === category.toLocaleLowerCase()) &&
      (!draft.trim() || category.toLocaleLowerCase().includes(draft.trim().toLocaleLowerCase()))
    );
  }, [existingEpisodes, value, draft]);

  const commitCategory = (nextDraft = draft) => {
    const category = nextDraft.trim();
    if (!category) return;
    const exists = categories.some((item) => item.toLocaleLowerCase() === category.toLocaleLowerCase());
    if (!exists) onChange([...categories, category].join(", "));
    setDraft("");
    setIsOpen(false);
  };

  const removeCategory = (removed) => {
    onChange(categories.filter((category) => category !== removed).join(", "));
  };

  const chooseSuggestion = (category) => {
    onChange([...categories, category].join(", "));
    setDraft("");
    setIsOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitCategory();
    } else if (event.key === "Escape") {
      setIsOpen(false);
    } else if (event.key === "Backspace" && !draft && categories.length) {
      removeCategory(categories[categories.length - 1]);
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData.getData("text");
    if (!pasted.includes(",")) return;
    event.preventDefault();
    const additions = splitCategories(`${draft},${pasted}`);
    const unique = new Map(categories.map((category) => [category.toLocaleLowerCase(), category]));
    additions.forEach((category) => {
      const key = category.toLocaleLowerCase();
      if (!unique.has(key)) unique.set(key, category);
    });
    onChange([...unique.values()].join(", "));
    setDraft("");
    setIsOpen(false);
  };

  return (
    <div className="relative min-h-12 w-full rounded-lg border border-gray-300 bg-white p-2.5 shadow-sm focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20">
      <div className="flex min-h-7 flex-wrap items-center gap-2">
        {categories.map((category) => (
          <span key={category.toLocaleLowerCase()} className="inline-flex max-w-full items-center gap-1 rounded-full border border-violet-200 bg-violet-50 py-1 pl-3 pr-1.5 text-sm font-semibold text-black">
            <span className="break-words">{category}</span>
            <button type="button" disabled={disabled} onClick={() => removeCategory(category)} aria-label={`Remove ${category} category`} className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-black transition hover:bg-violet-100 disabled:opacity-50">
              <IoCloseSharp size={15} aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          disabled={disabled}
          onFocus={() => setIsOpen(true)}
          onChange={(event) => { setDraft(event.target.value); setIsOpen(true); }}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={() => { if (draft.trim()) commitCategory(); else setTimeout(() => setIsOpen(false), 120); }}
          placeholder={categories.length ? "Add another category…" : "Type or choose a category"}
          aria-label="Add episode category"
          className="min-w-[180px] flex-1 border-0 bg-transparent px-2 py-1 text-sm !text-black outline-none placeholder:!text-gray-500 focus:border-0 focus:outline-none focus:ring-0"
        />
        <button type="button" aria-label="Show existing categories" aria-expanded={isOpen} onMouseDown={(event) => event.preventDefault()} onClick={() => setIsOpen((open) => !open)} className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-black hover:bg-violet-50">
          <FaChevronDown className={`text-xs transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
      </div>
      {isOpen && suggestions.length > 0 && (
        <div role="listbox" aria-label="Previously used categories" className="absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-xl">
          {suggestions.map((category) => (
            <button key={category.toLocaleLowerCase()} type="button" role="option" aria-selected="false" onMouseDown={(event) => event.preventDefault()} onClick={() => chooseSuggestion(category)} className="block w-full rounded-md px-3 py-2 text-left text-sm text-black hover:bg-violet-50">
              {category}
            </button>
          ))}
        </div>
      )}
      <p className="mt-2 px-1 text-xs text-gray-600">Choose an existing category or type a new one and press Enter. Select × to remove a category.</p>
    </div>
  );
}
