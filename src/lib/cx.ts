type Value = string | false | null | undefined;

/** Penggabung className minimalis (pengganti clsx tanpa dependensi). */
export function clsx(...values: Value[]) {
  return values.filter(Boolean).join(' ');
}
