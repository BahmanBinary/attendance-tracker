import { createContext } from "react";

export const initialValue = {
  state: { db: null },

  setState: () => {},

  setActions: () => {},

  actions: {
    setDB(setState) {
      return (db) =>
        setState((currentState) => {
          currentState.db = db;

          return { ...currentState };
        });
    },
  },
};

const DataBaseContext = createContext(initialValue);

export default DataBaseContext;
