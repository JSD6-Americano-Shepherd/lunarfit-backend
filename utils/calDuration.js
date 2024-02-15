const calculateDuration = (start, end) => {
  const [startHours, startMinutes] = start.split(":").map(Number);
  const [endHours, endMinutes] = end.split(":").map(Number);
  const startDate = new Date(0, 0, 0, startHours, startMinutes);
  const endDate = new Date(0, 0, 0, endHours, endMinutes);

  let duration = (endDate - startDate) / (1000 * 60); // Convert milliseconds to minutes
  if (duration < 0) {
    duration += 24 * 60; // Adjust for crossing over midnight
  }
  return duration;
};

export { calculateDuration };
