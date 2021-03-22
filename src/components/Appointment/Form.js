import React, { useState } from 'react';

import InterviewerList from '../InterviewerList';
import Button from '../Button';

export default function Form(props) {

  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");

  const reset = () => {
    setName("");
    setInterviewer('null');
    setError('');
  };

  const cancel = () => {
    reset();
    props.onCancel();
  };

  const validate = () => {
    if (name === '') {
      setError("Student name cannot be blank");
      return;
    }
    //since the error is set to state, reset the error to change the state
    setError("");
    props.onSave(name, interviewer)
  }

  return (

    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        {/* form has an auto-Enter submit so it must be disabled */}
        <form autoComplete="off" onSubmit={event => event.preventDefault()} >
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name}
            onChange={event => setName(event.target.value)}
            data-testid="student-name-input"//JEST test id
          />
        </form>
        <section className="appointment__validation">{error}</section>
        {/* Error message for blank student name */}
        <InterviewerList interviewers={props.interviewers} value={interviewer} onChange={setInterviewer} />


      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={validate}>
            Save
          </Button>
        </section>
      </section>
    </main >



  );
}