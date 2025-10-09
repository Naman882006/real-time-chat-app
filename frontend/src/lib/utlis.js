export function formatMesssageTime(date) {
  const d = new Date(date);
  const now = new Date();

  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear();

  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (isToday) return time; // Today → show time
  if (isYesterday) return `Yesterday ${time}`; // Yesterday → show 'Yesterday HH:MM'

  const optionsSameYear = { day: "2-digit", month: "short" }; // e.g., 09 Oct
  const optionsPrevYear = { day: "2-digit", month: "short", year: "numeric" }; // e.g., 15 Sep 2024

  const dateString =
    d.getFullYear() === now.getFullYear()
      ? d.toLocaleDateString("en-US", optionsSameYear)
      : d.toLocaleDateString("en-US", optionsPrevYear);

  return `${dateString} ${time}`;
}
