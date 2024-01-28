import "./style.css";
import { createMachine, interpret, send } from "xstate";

const callback = (sendBack, receive) => {
  let timeout;
  receive((event) => {
    console.log(`Received ${event}`);
    timeout = setTimeout(() => sendBack({ type: "PING" }), 1000);
  });

  // to clear timeouts if we exit from the state which invoked this callback actor
  return () => {
    clearTimeout(timeout);
  };
};

const machine = createMachine({
  initial: "loading",
  states: {
    loading: {
      invoke: {
        // id is used to gie a nicer name to the invoked actor done event in the parent machine state name
        id: "fetchNumber",
        src: (context, event) => callback,
        onDone: {
          target: "success",
          actions: (_, event) => console.log("DONE! ", event),
        },
      },
      on: {
        NOTIFY: { actions: send("ANY_EVENT", { to: "fetchNumber" }) },
        PING: {
          target: "success",
        },
      },
    },
    success: {},
    canceled: {},
  },
});

const service = interpret(machine).start();

// the service (i.e. the interpreted machine) is the actor, which we subscribe to
// the machine automatically sends back the 'done' event once the invoked actor has finished
// this means a parent machine sends back state transitions linked to their invoked actors
service.subscribe((state) => console.log(state));
