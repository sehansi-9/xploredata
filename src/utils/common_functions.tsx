export default function formatText({ name }: { name: string }) {
  if (!name) return;

  const dateMatch = name.match(/(\d{4})[-_]\d{2}[-_]\d{2}/);
  const year = dateMatch ? dateMatch[1] : "";

  const withoutDate = name.replace(/\d{4}[-_]\d{2}[-_]\d{2}/g, "");

  const cleaned = withoutDate.replace(/_/g, " ").trim();

  const firstSpaceIndex = cleaned.indexOf(" ");
  const capitalized =
    firstSpaceIndex === -1
      ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
      : cleaned.charAt(0).toUpperCase() +
        cleaned.slice(1);

  return year ? `${capitalized} ${year}` : capitalized;
}
