module.exports.onWindowClose = function (window, state) {
  return function (event) {
    if (!state.quiting) {
      event.preventDefault();

      window.hide();
    }
  };
};
