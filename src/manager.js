//https://css-tricks.com/implementing-private-variables-in-javascript/#the-module-design-pattern
let createStore = (reducer) => {
  let state = reducer();
  let listeners = [];

  let getState = () => {
    return state;
  };

  // Return an unsubscribe function.
  let subscribe = (cb) => {
    listeners.push(cb);
    return () => {
      listeners = listeners.filter((item) => {
        return item !== cb;
      });
    };
  };

  let dispatch = (action) => {
    state = reducer(state, action);

    listeners.forEach((listener) => {
      listener();
    });
  };

  return {
    getState,
    subscribe,
    dispatch,
  };
};
export default createStore;
