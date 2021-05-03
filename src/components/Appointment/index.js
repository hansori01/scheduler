import React, {useEffect} from 'react';
import useVisualMode from 'hooks/useVisualMode';

import Header from './Header';
import Show from './Show';
import Empty from './Empty';
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

  const interviewers = props.interviewer;
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  const deleteConfirm = 'Are you sure you want to delete?';

// side effect to transtion to correct mode with websocket implementation
  useEffect(() => {
    if (props.interview && mode === EMPTY) {
      console.log('running useeffect ONE')
      transition(SHOW);
    }
    if (props.interview === null && mode === SHOW) {
      console.log('props.interview', props.interview)
      transition(EMPTY);
    }
  }, [props.interview, transition, mode]);


  function save(name, interviewer) {
    let edit; //if mode is at EDIT, updateSpot does not change value of spots
    if (mode === 'EDIT') edit = true;

    transition(SAVING);
    const interview = {
      student: name,
      interviewer
    };

    props.bookInterview(props.id, interview, edit)
      .then(() => transition(SHOW))
      .catch(err => transition(ERROR_SAVE, true));
  }

  function deleteAppointment() {
    transition(DELETING, true);

    props.onDelete(props.id)
      .then(res => transition(SHOW))
      .catch(err => transition(ERROR_DELETE, true));
  }


  return (
    <article className="appointment" data-testid="appointment">
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
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
        />
      )}
    </article>
  );
}