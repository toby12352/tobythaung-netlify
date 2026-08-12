/** Lightweight in-memory nav trail via React Router location.state. No storage, no effects. */

export const NAV_ENTRIES = {
  "my-work": [{ label: "My Work", to: "/my-work" }],
  "work-timeline": [
    { label: "About", to: "/about" },
    { label: "Work Timeline", to: "/work-timeline" },
  ],
};

export function entryTrail(key) {
  return NAV_ENTRIES[key] || null;
}

export function readNavTrail(location) {
  const trail = location?.state?.navTrail;
  return Array.isArray(trail) && trail.length > 0 ? trail : null;
}

export function navState(trail) {
  return trail ? { navTrail: trail } : undefined;
}

export function resolveNavTrail(location, fallbackEntryKey) {
  return readNavTrail(location) || entryTrail(fallbackEntryKey) || [];
}

/** Append a crumb when drilling into a child page; keeps prior trail intact. */
export function extendNavTrail(location, crumb, fallbackEntryKey) {
  const base = resolveNavTrail(location, fallbackEntryKey);
  return [...base, crumb];
}
