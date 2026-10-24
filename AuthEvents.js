const listeners = new Set();

export const subscribeAuthChange = (callback) => {
  listeners.add(callback);

  return () => {
    listeners.delete(callback);
  };
};

export const notifyAuthChange = () => {
  listeners.forEach((callback) => callback());
};