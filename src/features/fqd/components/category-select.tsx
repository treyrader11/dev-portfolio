import {
  FQD_CATEGORIES,
  FQD_CATEGORY_NAMES,
  type FqdCategory,
} from "../types/fqd-types";

interface Props {
  category: string;
  subcategory: string;
  onCategoryChange: (value: string) => void;
  onSubcategoryChange: (value: string) => void;
}

const SELECT =
  "w-full rounded-lg border border-dark-600 bg-dark-600 px-3 py-2.5 text-sm text-white transition-all focus:outline-none focus:ring-1 focus:ring-secondary disabled:opacity-50";

// Category + dependent Subcategory dropdowns. Changing the category clears the
// subcategory so it can't be left mismatched.
export function CategorySelect({
  category,
  subcategory,
  onCategoryChange,
  onSubcategoryChange,
}: Props) {
  const subs =
    category && category in FQD_CATEGORIES
      ? FQD_CATEGORIES[category as FqdCategory]
      : [];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-white">Category</label>
        <select
          className={SELECT}
          value={category}
          onChange={(e) => {
            onCategoryChange(e.target.value);
            onSubcategoryChange("");
          }}
        >
          <option value="">Select category</option>
          {FQD_CATEGORY_NAMES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-white">Subcategory</label>
        <select
          className={SELECT}
          value={subcategory}
          disabled={!subs.length}
          onChange={(e) => onSubcategoryChange(e.target.value)}
        >
          <option value="">
            {subs.length ? "Select subcategory" : "Select a category first"}
          </option>
          {subs.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
