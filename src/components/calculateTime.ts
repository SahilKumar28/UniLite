export function calculateTime(semesterNo: number) {
  const totalDays = 1380;
  const years = Math.floor((semesterNo - 1) / 2);
  let remainingDays = totalDays - 365 * years;

  const today = new Date();
  const curYear = today.getFullYear();
  const admissionDate = new Date(curYear, 7, 19); // 19 Aug

  if (today < admissionDate) {
    admissionDate.setFullYear(curYear - 1);
  }

  // diff in milliseconds
  const diffMs = today.getTime() - admissionDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // remaining days
  remainingDays = remainingDays - diffDays;

  // ab total remaining milliseconds
  const remainingMs = remainingDays * 24 * 60 * 60 * 1000 - (diffMs % (24 * 60 * 60 * 1000));

  const leftYears = Math.floor(remainingDays / 365);
  const leftDays = remainingDays % 365;
  const leftHours = Math.floor((remainingMs / (1000 * 60 * 60)) % 24);
  const leftMinutes = Math.floor((remainingMs / (1000 * 60)) % 60);
  const leftSeconds = Math.floor((remainingMs / 1000) % 60);

  return { years: leftYears, days: leftDays, hours: leftHours, minutes: leftMinutes, seconds: leftSeconds };
}
