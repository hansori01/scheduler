import React, { useState, useEffect } from "react";
import axios from 'axios';


export default function useApplicationData() {

  // state of the picked day
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
    // bookInterview: { bookInterview }
  });


  // update Spot of the day in state as interview is saved or deleted
  function updateSpot(value) {
    const currentDay = state.days.find(day => day.name === state.day)
    const copyOfDays = [...state.days];

    copyOfDays.forEach(day => {
      if (day.id === currentDay.id) day.spots += value
    });

    return copyOfDays;
  };


  // booking interview appointment
  function bookInterview(id, interview, edit) {
    //new appointment obj with current state of appointment at id, and interviewer/student details
    const appointment = { ...state.appointments[id], interview: { ...interview } };
    const appointments = { ...state.appointments, [id]: appointment };
    let days;
    if (!edit) {
      days = updateSpot(-1);
    } else {
      days = updateSpot(0);
    }

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(res => { setState({ ...state, appointments, days }) });
  };


  function onDelete(id) {
    const appointment = { ...state.appointments[id], interview: null };
    const appointments = { ...state.appointments, [id]: appointment };
    const days = updateSpot(+1)

    return axios.delete(`/api/appointments/${id}`, appointment)
      .then(res => setState({ ...state, appointments, days }));
  };

  const setDay = day => setState({ ...state, day }); //updates day key


  //proxy added to package.json to avoid CORS error

  //fetch and update appointment / days data 
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then(all => {
      const days = all[0].data;
      const appointments = all[1].data;
      const interviewers = all[2].data;
      setState(prev => ({ ...prev, days, appointments, interviewers }));
    });
  }, []);//run useEffect on top of rendering

  return { state, setDay, bookInterview, onDelete };

}