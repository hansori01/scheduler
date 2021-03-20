import React from 'react';

import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import useVisualMode from 'hooks/useVisualMode'
import Form from './Form';
import Status from './Status';
import Confirm from './Confirm';
import Error from './Error';

import './style.scss';


//mode constants
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

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
      .catch(err => transition(ERROR_SAVE))
  };

  //deleting appointment
  function deleteAppointment() {
    transition(DELETING);
    console.log(props.id);
    props.onDelete(props.id)
      .then(res => transition(EMPTY))
      .catch(err => transition(ERROR_DELETE))

  }


  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SAVING && <Status message={'Saving...'} />}
      {mode === DELETING && <Status message={'Deleting...'} />}
      {mode === ERROR_SAVE && <Error message={'There was an issue with saving your appointment'} onClose={back} />}
      {mode === ERROR_DELETE && <Error message={'There was an issue with deleting your appointment'} onClose={back} />}
      {mode === CONFIRM && <Confirm onCancel={back} onConfirm={deleteAppointment} message={deleteConfirm} />}
      { mode === SHOW && props.interview && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers={interviewers}
          onCancel={back}
          onSave={save}
        />
      )}
      {mode === EDIT && (
        <Form
          interviewers={interviewers}
          onCancel={back}
          onSave={save}
          student={props.interview.student}
          interviewer={props.interview.interviewer.id}
        />
      )}
    </article>
  );
}