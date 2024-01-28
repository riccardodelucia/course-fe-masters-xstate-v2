import "./style.css";
import { createMachine, interpret } from "xstate";

// When machines are interpreted, they become actors.
// A machine is indeed something that provides out of the box:
// - a send method, to send its events (action method send)
// - a subscribe method, to receive 'events' from it (called on the service)

// the actor (i.e. the machine itself) is able to invoke new actors, with invoke
const machine = createMachine({
  initial: "loading",
  states: {
    loading: {
      invoke: {
        // id is used to gie a nicer name to the invoked actor done event in the parent machine state name
        id: "fetchNumber",
        src: (context, event) =>
          //returns the actor
          new Promise((res) => {
            // this promise is basically a invoked actor from the actor machine
            setTimeout(() => {
              res(42); // will appear in the data property of the event received by the subscribers
            }, 10000);
          }),
        onDone: {
          target: "success",
          actions: (_, event) => console.log("DONE! ", event),
        },
      },
      on: {
        CANCEL: "canceled",
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
