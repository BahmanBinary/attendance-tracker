import { useState } from "react";

export default function Provider({
  context: Context,
  initialValue: {
    state: contextState,
    setState: setContextState,
    setActions: setContextActions,
    actions: contextActions,
  },
  children,
}) {
  const [providerState, setState] = useState({ ...contextState });
  const [actions, setActions] = useState(() => {
    const actions = {};

    for (const actionName in contextActions)
      actions[actionName] = contextActions[actionName](setState);

    return { ...actions };
  });

  return (
    <Context.Provider
      value={{
        state: providerState,
        setState,
        setActions,
        actions,
      }}
    >
      {children}
    </Context.Provider>
  );
}
