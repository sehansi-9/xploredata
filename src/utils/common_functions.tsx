export default function formatText(
  { name }: { name: string },
  options?: { removeYear?: boolean }
) {
  if (!name) return;

  const dateMatch = name.match(/(\d{4})[-_]\d{2}[-_]\d{2}/);
  const year = dateMatch ? dateMatch[1] : "";

  let withoutDate = name.replace(/\d{4}[-_]\d{2}[-_]\d{2}/g, "");
  withoutDate = withoutDate.replace(/_/g, " ").trim();

  const firstSpaceIndex = withoutDate.indexOf(" ");
  const capitalized =
    firstSpaceIndex === -1
      ? withoutDate.charAt(0).toUpperCase() + withoutDate.slice(1)
      : withoutDate.charAt(0).toUpperCase() + withoutDate.slice(1);

  if (options?.removeYear || !year) return capitalized;

  return `${capitalized} - ${year}`;
}
