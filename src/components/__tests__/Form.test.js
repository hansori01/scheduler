import React from "react";

import { render, cleanup, fireEvent } from "@testing-library/react";

import Form from "components/Appointment/Form";

afterEach(cleanup);

describe("Form", () => {

  const interviewers = [
    {
      id: 1,
      name: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png"
    }
  ];


  it("renders without student name if not provided", () => {
    const { getByPlaceholderText } = render(
      <Form interviewers={interviewers} />
    );

    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
  });


  it("renders with initial student name", () => {
    const { getByTestId } = render(
      <Form interviewers={interviewers} name="Sori" />
    );
    expect(getByTestId("student-name-input")).toHaveValue("Sori");
  });


  it("validates that the student name is not blank", () => {
    const onSave = jest.fn();

    const { getByText } = render(
      <Form interviewers={interviewers} onSave={onSave} name='' />
    );

    fireEvent.click(getByText("Save"));

    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });


  it("calls onSave function when the name is defined", () => {
    //mock function
    const onSave = jest.fn();

    const { getByText, queryByText } = render(
      <Form interviewers={interviewers} onSave={onSave} name='Sori' />
    );

    //jest fires event on click
    fireEvent.click(getByText("Save"));

    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("Sori", null);
  });

});