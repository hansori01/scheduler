import React from "react";

import { render, cleanup, waitForElement } from "@testing-library/react";

import Application from "components/Application";
import { fireEvent } from "@testing-library/react/dist";

afterEach(cleanup);

it("defaults to Monday and changes the schedule when a new day is selected", async () => {
  const { getByText } = render(<Application />);

  //async test - on render, wait for element 'Monday' then click 'Tuesday'
  await waitForElement(() => getByText("Monday"));

  fireEvent.click(getByText("Tuesday"));
  
  //expect to see interviewer's name in the document
  expect(getByText("Leopold Silvers")).toBeInTheDocument();



});

