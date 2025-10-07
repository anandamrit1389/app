export function publishFormatDate(date: Date): string {
  const now = new Date();
  const timeDiff = now.getTime() - date.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutesDiff = Math.floor(timeDiff / (1000 * 60));

  if (minutesDiff < 1) {
    return `1 minute ago`;
  } else if (minutesDiff < 60) {
    return `${minutesDiff} minute${minutesDiff > 1 ? 's' : ''} ago`;
  } else if (hoursDiff < 24) {
    return `${hoursDiff} hour${hoursDiff > 1 ? 's' : ''} ago`;
  } else if (daysDiff < 7) {
    return `${daysDiff} day${daysDiff > 1 ? 's' : ''} ago`;
  } else if (daysDiff < 30) {
    const weeksDiff = Math.floor(daysDiff / 7);
    return `${weeksDiff} week${weeksDiff > 1 ? 's' : ''} ago`;
  } else {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
