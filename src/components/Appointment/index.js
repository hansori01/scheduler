import React from 'react';

import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import useVisualMode from 'hooks/useVisualMode'
import Form from './Form';

import './style.scss';

//mode constants
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";

export default function Appointment(props) {

  const interviewers = props.interviewer

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );


  // saving interview appointment
  function save(name, interviewer) {
    // transition(SAVING)
    const interview = {
      student: name,
      interviewer
    };
    console.log('save details', interviewer, interview);

    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
  };


  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      { mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
      )}
      {mode === CREATE && (
        <Form
          // student={props.interview.student}
          interviewers={interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
    </article>
  );
}