
export const getAppointmentsForDay = (state, day) => {
  const [filteredDay] = state.days.filter(days => days.name === day);

  if (!filteredDay || !state.days.length === 0) return [];

  const appointments = filteredDay.appointments;
  const appointmentDetails = appointments.map(element => state.appointments[element]);

  return appointmentDetails;
};


export const getInterview = (state, interview) => {
  if (!interview) return null;

  const interviewerNumber = interview.interviewer
  const student = interview.student
  const interviewerList = { ...state.interviewers }
  const interviewer = interviewerList[interviewerNumber]

  return { student, interviewer }
};


export const getInterviewersForDay = (state, day) => {
  const [filteredDay] = state.days.filter(days => days.name === day);

  if (!filteredDay || !state.days.length === 0) return [];

  const interviewers = filteredDay.interviewers;
  const interviewerDetails = interviewers.map(element => state.interviewers[element]);

  return interviewerDetails;
};

