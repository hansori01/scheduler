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
  function bookInterview(id, interview) {
    //new appointment obj with current state of appointment at id, and interviewer/student details
    const appointment = { ...state.appointments[id], interview: { ...interview } };
    const appointments = { ...state.appointments, [id]: appointment };
    const days = updateSpot(-1)

    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(res => { setState({ ...state, appointments, days }) });
  };


  function onDelete(id) {
    const appointment = { ...state.appointments[id], interview: null };
    const appointments = { ...state.appointments, [id]: appointment };
    const days = updateSpot(+1)

    return axios.delete(`http://localhost:8001/api/appointments/${id}`, appointment)
      .then(res => setState({ ...state, appointments, days }));
  };

  const setDay = day => setState({ ...state, day }); //updates day key




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

  return { state, setDay, bookInterview, onDelete };

}


//find number of avail spots