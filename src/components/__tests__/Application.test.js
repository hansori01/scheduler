import React from "react";
import axios from "axios";

import { render, cleanup, waitForElement } from "@testing-library/react";

import Application from "components/Application";
import { fireEvent } from "@testing-library/react/dist";

//this allows us to used scoped queries
import { getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, queryByText } from "@testing-library/react";


afterEach(cleanup);


describe("Application", () => {

  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    //async test - on render, wait for element 'Monday' then click 'Tuesday'
    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    //expect to see interviewer's name in the document
    expect(getByText("Leopold Silvers")).toBeInTheDocument();

  });


  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {

    //debug and prettyDOM is used to log when debugging
    const { container, debug } = render(<Application />);
    //wait for Archie Cohen to load
    await waitForElement(() => getByText(container, "Archie Cohen"));
    //returns an array of appointments with data-testid='appointment
    const appointments = getAllByTestId(container, 'appointment');
    const [appointment] = appointments;

    fireEvent.click(getByAltText(appointment, "Add"))

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    // find "Monday" from an array of days
    const day = getAllByTestId(container, 'day').find(day =>
      //we use queryBy to have null returned if node is not found.
      queryByText(day, "Monday")
    );

    expect(getByText(day, 'no spots remaining')).toBeInTheDocument();
  });


  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {

    //debug and prettyDOM is used to log when debugging
    const { container } = render(<Application />);
    //wait for Archie Cohen to load
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Delete"));

    expect(getByText(appointment, 'Are you sure you want to delete?')).toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Confirm"));

    expect(getByText(appointment, 'Deleting...')).toBeInTheDocument();

    await waitForElement(() => getByAltText(appointment, "Add"));

    expect(getByAltText(appointment, "Add")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();

  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Edit"));

    expect(getByText(appointment, 'Save')).toBeInTheDocument();


    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Farty Cohen" }
    });

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, 'Saving...')).toBeInTheDocument();

    await waitForElement(() => getByAltText(container, "Edit"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, '1 spot remaining')).toBeInTheDocument();

    // debug();
  });

  
  it("shows the save error when failing to save an appointment", () => {
    axios.put.mockRejectedValueOnce();
  });
})
