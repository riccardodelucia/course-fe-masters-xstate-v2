import "./style.css";
import { createMachine, interpret, send } from "xstate";

const callback = (sendBack, receive) => {
  receive((event) => {
    console.log(`Received ${event}`);
    setTimeout(() => sendBack({ type: "PING" }), 1000);
  });
};

const fetchMachine = createMachine({
  initial: "fetching",
  states: {
    fetching: {
      after: {
        1000: "success",
      },
    },
    success: {
      type: "final",
      data: { count: 42 }, // can be used to set some data for the final state of the machine
      // data is then sent back as the done state payload for this actor
    },
  },
});

const machine = createMachine({
  initial: "loading",
  states: {
    loading: {
      invoke: {
        // id is used to gie a nicer name to the spawned actor done event in the parent machine state name
        id: "fetchNumber",
        src: fetchMachine,
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
// the machine automatically sends back the 'done' event once the spawned actor has finished
// this means a parent machine sends back state transitions linked to their spawned actors
service.subscribe((state) => console.log(state));
