import { useEffect, useReducer } from "react";
import axios from 'axios';

const initialState = {
  day: "Monday",
  days: [],
  appointments: [],
  interviewers: [],
};

//using constants to avoid spelling errors
const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

//state management using useReducer
function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return {
        ...state,
        day: action.day
      };
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.days,
        appointments: action.appointments,
        interviewers: action.interviewers,
      };
    case SET_INTERVIEW: {
      const appointment = {
        ...state.appointments[action.id],
        interview: { ...action.interview },
      };

      const appointments = {
        ...state.appointments,
        [action.id]: appointment,
      };

      return {
        ...state,
        appointments,
      };
    }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}


export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, initialState);


  //handler for remaining spots for day
  function updateSpot(value) {
    const currentDay = state.days.find(day => day.name === state.day);
    const copyOfDays = [...state.days];
    const updatedSpotsDays = copyOfDays.map(day => {
      if (day.id !== currentDay.id) {
        return { ...day }
      }
      return { ...day, spots: day.spots += value };
    });

    return updatedSpotsDays;
  }


  const setDay = day => dispatch({ type: "SET_DAY", day }) //updates day key

  // handler for booking interview and updating database
  function bookInterview(id, interview, edit) {
    let days;
    if (!edit) {
      days = updateSpot(-1);
    } else {
      days = updateSpot(0);
    }

    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then(res => {
        dispatch({ type: SET_INTERVIEW, id, interview });
      });
  };

// handler for deleting interview and updating database
  function onDelete(id) {
    updateSpot(+1)
    // const appointment = { ...state.appointments[id], interview: null };

    return axios
      .delete(`/api/appointments/${id}`)
      .then(res => dispatch({ type: SET_INTERVIEW, id, interview: null }))
  };

  //on rendering app, fetch and update the state from database
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then(all => {
      const [days, appointments, interviewers] = all;
      dispatch({
        type: SET_APPLICATION_DATA,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data,
      })
    });
  }, []);

  //setting up WebSocket
  useEffect(() => {
    
    const cleanup = () => {
      socket.close()
    }
    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    socket.onopen = () => {
      socket.send('ping')
      
      socket.onmessage = event => {
        console.log('socket msg received', event.data);
        
        const data = JSON.parse(event.data);
        
        if (typeof data === "object" && data.type === "SET_INTERVIEW") {
          dispatch(data);
        }
      }
    }

return cleanup;

    //dispatch dependency
  }, []);

  return { state, setDay, bookInterview, onDelete };
}