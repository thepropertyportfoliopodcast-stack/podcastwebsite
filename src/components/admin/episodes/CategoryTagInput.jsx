import React, { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

const splitCategories = (value = "") => String(value)
  .split(",")
  .map((category) => category.trim())
  .filter(Boolean);

export default function CategoryTagInput({ value = "", onChange, disabled = false }) {
  const [draft, setDraft] = useState("");
  const categories = splitCategories(value);

  const commitDraft = (nextDraft = draft) => {
    const category = nextDraft.trim();
    if (!category) return;
    const alreadyAdded = categories.some((item) => item.toLocaleLowerCase() === category.toLocaleLowerCase());
    if (!alreadyAdded) onChange([...categories, category].join(", "));
    setDraft("");
  };

  const removeCategory = (removed) => {
    onChange(categories.filter((category) => category !== removed).join(", "));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitDraft();
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
  };

  return (
    <div className="min-h-12 w-full rounded-lg border border-gray-700 bg-[#1c1c1c] p-2.5 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-500/30">
      <div className="flex min-h-7 flex-wrap items-center gap-2">
        {categories.map((category) => (
          <span key={category.toLocaleLowerCase()} className="inline-flex max-w-full items-center gap-1 rounded-full border border-violet-300/30 bg-violet-500/15 py-1 pl-3 pr-1.5 text-sm font-semibold text-violet-100">
            <span className="break-words">{category}</span>
            <button
              type="button"
              disabled={disabled}
              onClick={() => removeCategory(category)}
              aria-label={`Remove ${category} category`}
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-violet-100 transition hover:bg-violet-300/20 hover:text-white disabled:opacity-50"
            >
              <IoCloseSharp size={15} aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          disabled={disabled}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={() => draft.trim() && commitDraft()}
          placeholder={categories.length ? "Add another category…" : "Type a category and press Enter"}
          aria-label="Add episode category"
          className="min-w-[180px] flex-1 border-0 bg-transparent px-2 py-1 text-sm !text-white outline-none placeholder:text-gray-400 focus:border-0 focus:outline-none focus:ring-0"
        />
      </div>
      <p className="mt-2 px-1 text-xs text-gray-400">Type each category and press Enter. Select × to remove a category.</p>
    </div>
  );
}
