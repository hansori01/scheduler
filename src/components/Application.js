import React, { useState, useEffect } from "react";
import axios from 'axios';

import DayList from "./DayList";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors";
import useVisualMode from "hooks/useVisualMode";

import "components/Application.scss";


export default function Application() {
  // state of the picked day
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
    // bookInterview: { bookInterview }
  });

  // booking interview appointment
  function bookInterview(id, interview) {
    //new appointment obj with current state of appointment at id, and interviewer/student details
    const appointment = { ...state.appointments[id], interview: { ...interview } };
    const appointments = { ...state.appointments, [id]: appointment };
    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(res => { setState({ ...state, appointments }) });
  };


  //make cancel function
  //if appointment[id].interview exists
  // change appointment[id].interview to null
  function onDelete(id) {
    const appointment = { ...state.appointments[id], interview: null };
    const appointments = { ...state.appointments, [id]: appointment };
    console.log(id)
    return axios.delete(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then(res => {
        console.log('axios', res)
        setState({
          ...state,
          appointments
        });
      });
  };

  const setDay = day => setState({ ...state, day }); //updates day key
  //selector functions for rendering appointments
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const interviewerForDay = getInterviewersForDay(state, state.day)

  //rendering the appointments for picked day
  const appointments = dailyAppointments.map(appointment => {
    const interview = getInterview(state, appointment.interview)
    // if(appointment.interview) console.log('appointment', appointment.interview.interviewer);
    return <Appointment
      key={appointment.id}
      id={appointment.id}
      time={appointment.time}
      interview={interview}
      interviewer={interviewerForDay}
      bookInterview={bookInterview}
      onDelete={onDelete}
    />;
  });

  //proxy added to package.json to avoid CORS error
  useEffect(() => {
    //axios receives data in arrays using promise all
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers')
    ]).then(all => {
      const days = all[0].data;
      const appointments = all[1].data;
      const interviewers = all[2].data;
      setState(prev => ({ ...prev, days, appointments, interviewers }));
    });
  }, []);


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
