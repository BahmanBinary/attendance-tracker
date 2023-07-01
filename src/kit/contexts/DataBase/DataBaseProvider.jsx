import React from "react";
import Provider from "../Provider";
import DataBaseContext, { initialValue } from "./DataBaseContext";

export default function DataBaseProvider({ children }) {
  return (
    <Provider context={DataBaseContext} initialValue={initialValue}>
      {children}
    </Provider>
  );
}
