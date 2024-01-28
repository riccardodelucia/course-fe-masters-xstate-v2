import "./style.css";

// 1) EVENT-FIRST architecture
// PROBLEM: the user can send this event multiple times
function transition1(state, event) {
  switch (event.type) {
    case "FETCH":
      console.log("Starting to fetch data");
      break;
    default:
      break;
  }
}

window.transition1 = transition1;

// First solution: use if case to filter out code depending on the status
function transition2(state, event) {
  switch (event.type) {
    case "FETCH":
      if (state.status !== "loading") {
        console.log("Starting to fetch data");
        return { status: "loading" };
      }
      break;
    default:
      break;
  }
  return state;
}

window.transition2 = transition2;

// 2) STATE-FIRST architecture
function transition(state, event) {
  switch (state.status) {
    case "idle":
      if (event.type === "FETCH") {
        console.log("Starting to fetch data");
        return { status: "loading" };
      }
      return state;
    case "loading":
      // other behavior
      break;
    default:
      break;
  }
  return state;
}

window.transition3 = transition3;

// Object representation of the state machine

const machine = {
  initial: "idle",
  states: {
    idle: {
      on: {
        FETCH: "loading",
      },
    },
    loading: {},
  },
};

function transition(state, event) {
  const nextStatus = machine.states[state.status].on?.[event.type] ?? state.status;
  return { status: nextStatus };
}

window.machine = machine;
window.transition = transition;
