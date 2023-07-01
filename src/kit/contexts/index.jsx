import React from "react";
import DataBaseProvider from "./DataBase/DataBaseProvider";

export default function Contexts({ children }) {
  return <DataBaseProvider>{children}</DataBaseProvider>;
}
