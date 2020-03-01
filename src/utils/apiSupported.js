// THANKS https://github.com/beautifulinteractions/beautiful-react-hooks/blob/master/src/utils/isAPISupported.js

export function apiSupported(api) {
  return api in window;
}
