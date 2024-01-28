import "../style.css";

// Create a state machine transition function either using:
// - a switch statement (or nested switch statements)
// - or an object (transition lookup table)

const machine = {
  initial: "loading",
  states: {
    loading: {
      on: {
        PLAY: "playing",
      },
    },
    playing: {
      on: {
        PAUSE: "paused",
      },
    },
    paused: {
      on: {
        PLAY: "playing",
      },
    },
  },
};

// Also, come up with a simple way to "interpret" it, and
// make it an object that you can `.send(...)` events to.

const interpret = function (machine) {
  return {
    machine,
    state: {
      status: machine.initial,
    },
    send(event) {
      this.state.status = machine.states[this.state.status].on?.[event.type] ?? this.state.status;
    },
  };
};

window.service = interpret(machine);

console.log(service.state);
service.send({ type: "PLAY" });

console.log(service.state);
service.send({ type: "PLAY" });

console.log(service.state);
