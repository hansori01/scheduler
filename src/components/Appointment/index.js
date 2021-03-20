import React from 'react';

import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import useVisualMode from 'hooks/useVisualMode'
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';

import './style.scss';


//mode constants
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";

export default function Appointment(props) {

  const interviewers = props.interviewer

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const deleteConfirm = 'Are you sure you want to delete?'

  // saving interview appointment
  function save(name, interviewer) {
    transition(SAVING);
    const interview = {
      student: name,
      interviewer
    };
    console.log('save details', interviewer, interview);

    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
  };

  //deleting appointment
  function deleteAppointment() {
    transition(DELETING);
    console.log(props.id);
    props.onDelete(props.id)
      .then(res => transition(EMPTY))
  }


  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SAVING && <Status message={'Saving...'} />}
      {mode === DELETING && <Status message={'Deleting...'} />}
      {mode === CONFIRM && <Confirm onCancel={back} onConfirm={deleteAppointment} message={deleteConfirm} />}
      { mode === SHOW && props.interview && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
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