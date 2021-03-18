import React, { useState, useEffect } from "react";
import axios from 'axios';

import DayList from "./DayList";
import Appointment from "components/Appointment";

import "components/Application.scss";

// const appointmentsArray = [
//   {
//     id: 1,
//     time: "12pm",
//   },
//   {
//     id: 2,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   },
//   {
//     id: 3,
//     time: "2pm",
//   },
//   {
//     id: 4,
//     time: "3pm",
//     interview: {
//       student: "Sori Han",
//       interviewer: {
//         id: 2,
//         name: "Mrs. Teacher",
//         avatar: "https://i.imgur.com/twYrpay.jpg",
//       }
//     }
//   }, {
//     id: 5,
//     time: "4pm",
//   },
//   {
//     id: 6,
//     time: "5pm",
//   },
// ];


export default function Application() {

  // const [days, setDays] = useState([]);
  // const [day, setDay] = useState('Monday');
  // const [appointments, setAppointments] = useState({})

  //the ^^ line is refactored into a useState object
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  })

  const dailyAppointments = [];

  const appointments = dailyAppointments.map(appointment => {
    return <Appointment key={appointment.id} {...appointment} />
  })


  //new functions to update day or days in useState object
  const setDay = day => setState({ ...state, day }); //updates day key
  // const setDays = days => setState({ ...state, days }); //updates days key

  
  useEffect(() => {
    //proxy added to package.json to avoid CORS error

    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments')
    ]).then(all => {
      const days = all[0].data
      const appointments = all[1].data

      setState(prev => ({...prev, days, appointments}))
    })
  }, []);


  return (
    <main className="layout">
      <section className="sidebar">
        {/* sidebar */}
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
        {/* sidebar */}
      </section>
      <section className="schedule">
        {appointments}
        <Appointment key="last" time="5pm" />

      </section>
    </main>
  );
};
