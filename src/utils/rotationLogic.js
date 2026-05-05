export const calculateDutyBalance = (parents, weekSchedule) => {
  const balances = {};
  for (let i = 0; i < parents.length; i++) {
    balances[parents[i].id] = 0;
  }
  const days = Object.keys(weekSchedule);
  for (let i = 0; i < days.length; i++) {
    const driverId = weekSchedule[days[i]];
    for (let j = 0; j < parents.length; j++) {
      if (parents[j].id === driverId) {
        balances[parents[j].id] += 1;
      } else {
        balances[parents[j].id] -= 1;
      }
    }
  }
  const result = [];
  for (let i = 0; i < parents.length; i++) {
    result.push({
      ...parents[i],
      credits: balances[parents[i].id]
    });
  }
  return result;
};

export const assignDriverOfDay = (circle, date) => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = daysOfWeek[new Date(date).getDay()];
  const scheduleKeys = Object.keys(circle.weekSchedule);
  for (let i = 0; i < scheduleKeys.length; i++) {
    if (scheduleKeys[i] === dayName) {
      return circle.weekSchedule[scheduleKeys[i]];
    }
  }
  return null;
};
