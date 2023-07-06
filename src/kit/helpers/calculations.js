import dayjs from "dayjs";

export function employeeDetails(employees, attendances, settings) {
  employees = Object.fromEntries(
    employees.map((employee) => {
      const { rowid, ...otherProps } = employee;

      return [rowid, otherProps];
    })
  );

  attendances.forEach((attendance) => {
    const { employee_id, ...otherProps } = attendance;

    if (!employees[employee_id].attendances)
      employees[employee_id].attendances = [];

    employees[employee_id].attendances.push(otherProps);
  });

  const employeeNonWorkingTimes = {};
  for (const employeeID in employees)
    if (employees[employeeID].attendances)
      employeeNonWorkingTimes[employeeID] = calculateNonWorkingTimes(
        employees[employeeID].attendances,
        settings
      );

  return employeeNonWorkingTimes;
}

function calculateNonWorkingTimes(attendances, settings) {
  const { working_hours, holidays } = settings;
  const nonWorkingTimes = {
    overtime: 0,
    delay: 0,
    complete_leaves: 0,
    hourly_leaves: 0,
  };

  for (const attendance of attendances)
    if (attendance.leave)
      if (attendance.leave_type === "hourly")
        nonWorkingTimes.hourly_leaves += attendance.leave_hours;
      else nonWorkingTimes.complete_leaves += 1;
    else {
      const entrance = dayjs(attendance.entrance);
      const exit = dayjs(attendance.exit);

      const entranceWeekDay = entrance.weekday();

      if (
        entranceWeekDay === 6 ||
        holidays.some((date) => date === entrance.format("YYYY/MM/DD"))
      )
        nonWorkingTimes.overtime += exit.diff(entrance, "m");
      else {
        const formalStart5m = working_hours[entranceWeekDay][0];
        const formalEnd5m = working_hours[entranceWeekDay][1];

        const formalWorkTime = (formalEnd5m - formalStart5m) * 5;
        const workedTime = exit.diff(entrance, "m");

        const difference = workedTime - formalWorkTime;
        if (difference > 0) nonWorkingTimes.overtime += difference;

        const formalStart = entrance.startOf("d").add(formalStart5m * 5, "m");
        if (entrance.isAfter(formalStart))
          nonWorkingTimes.delay += entrance.diff(formalStart, "m");
      }
    }

  return nonWorkingTimes;
}
