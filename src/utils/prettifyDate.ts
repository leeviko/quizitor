const prettifyDate = (date: number) => {
  const now = new Date().getTime();
  const diffSeconds = (now - date) / 1000;
  const diffMinutes = diffSeconds / 60;
  const diffHours = diffMinutes / 60;
  const diffDays = diffHours / 24;
  const diffYears = diffDays / 365;

  if (diffSeconds < 60) {
    return 'now';
  }
  if (diffMinutes < 60) {
    return `${Math.round(diffMinutes)} minute${
      Math.round(diffMinutes) > 1 ? 's' : ''
    } ago`;
  }
  if (diffHours < 24) {
    return `${Math.round(diffHours)} hour${
      Math.round(diffHours) >= 2 ? 's' : ''
    } ago`;
  }
  if (diffHours >= 24) {
    return `${Math.round(diffDays)} day${
      Math.round(diffDays) >= 2 ? 's' : ''
    } ago`;
  }
  if (diffYears >= 1) {
    return `${Math.round(diffYears)} year${
      Math.round(diffYears) >= 2 ? 's' : ''
    } ago`;
  }

  return 'undefined';
};

export default prettifyDate;
