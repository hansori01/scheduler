import React, { useState, useEffect } from "react";
import axios from 'axios';

import DayList from "./DayList";
import Appointment from "components/Appointment";

import "components/Application.scss";

const appointmentsArray = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 3,
    time: "2pm",
  },
  {
    id: 4,
    time: "3pm",
    interview: {
      student: "Sori Han",
      interviewer: {
        id: 2,
        name: "Mrs. Teacher",
        avatar: "https://i.imgur.com/twYrpay.jpg",
      }
    }
  }, {
    id: 5,
    time: "4pm",
  },
  {
    id: 6,
    time: "5pm",
  },
];

const appointments = appointmentsArray.map(appointment => {
  return <Appointment key={appointment.id} {...appointment} />
})

export default function Application() {

  const [days, setDays] = useState([]);
  const [day, setDay] = useState('Monday');

  useEffect(() => {
    //proxy added to package.json to avoid CORS error
    axios.get('http://localhost:8001/api/days').then(response => {
      // console.log(response.data)
      setDays([...response.data])
    });
  }, []); //empty dependency as we only want this run at the top of the render


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
            days={days}
            day={day}
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
