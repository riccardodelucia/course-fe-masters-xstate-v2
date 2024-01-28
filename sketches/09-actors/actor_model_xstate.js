import "./style.css";
import { createMachine, interpret } from "xstate";

// We create a new machine, which becomes an actor when it is interpreted
// in fact, a machine is something that provides out of the box:
// - a send method, to send its events
// - a subscribe method, to receive 'events' from it

// the actor is able to spawn new actors, with invoke
const machine = createMachine({
  initial: "loading",
  states: {
    loading: {
      invoke: {
        id: "fetchNumber",
        src: (context, event) =>
          new Promise((res) => {
            // this promise is basically a spawned actor from the actor machine
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
service.subscribe((state) => console.log(state.value));
