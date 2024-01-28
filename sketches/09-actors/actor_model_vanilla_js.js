import "./style.css";
import { createMachine, interpret } from "xstate";

function countBehavior(state, event) {
  if (event.type === "INC") {
    return {
      ...state,
      count: state.count + 1,
    };
  }
}
function createActor(behavior, intialState) {
  let currentState = intialState;
  const listeners = new Set();
  return {
    send: (event) => {
      currentState = behavior(currentState, event);
      listeners.forEach((listener) => {
        listener(currentState);
      });
    },
    subscribe: (listener) => {
      listeners.add(listener);
      listener(currentState);
    },
    getSnapshot: () => currentState,
  };
}

const actor = createActor(countBehavior, { count: 42 });
window.actor = actor;

window.actor.subscribe((value) => console.log(value));
