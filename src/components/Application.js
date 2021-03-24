import React from "react";
// import axios from "axios";


import DayList from "./DayList";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";
import useApplicationData from "hooks/useApplicationData";

import "components/Application.scss";


export default function Application(props) {

  const {
    state,
    setDay,
    bookInterview,
    onDelete
  } = useApplicationData();

  //selector functions for rendering appointments
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const interviewerForDay = getInterviewersForDay(state, state.day)

  //rendering the appointments for picked day
  const appointments = dailyAppointments.map(appointment => {
    const interview = getInterview(state, appointment.interview)
    // if(appointment.interview) console.log('appointment', appointment.interview.interviewer);
    return( <Appointment
      key={appointment.id}
      id={appointment.id}
      time={appointment.time}
      interview={interview}
      interviewer={interviewerForDay}
      bookInterview={bookInterview}
      onDelete={onDelete}
    />
    );
  });


  return (
    <main className="layout">
      <section className="sidebar">
        {/* sidebar */}
        <img className="sidebar--centered" src="images/logo.png" alt="Interview Scheduler" />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img className="sidebar__lhl sidebar--centered" src="images/lhl.png" alt="Lighthouse Labs" />
        {/* sidebar */}
      </section>
      <section className="schedule">
        {appointments}
        <Appointment key="last" time="5pm" />

      </section>
    </main>
  );
}
