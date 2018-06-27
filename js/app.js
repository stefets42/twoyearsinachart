/**
 * Application module
 */
const App = (function (my, Sunburst) {

  my.closeIntroButtonElem = document.querySelector('button#closeIntro');
  my.introElem = document.querySelector('aside#intro');

  /**
   * Registers callbacks & events
   * Calling this method will 'start' the app
   * @returns {void}
   */
  my.vroum = function () {
    getJson().then(json => {
      Sunburst.vroum(json);
    });

    my.closeIntroButtonElem.onclick = closeIntro;
  }

  const closeIntro = function () {
    my.introElem.style.opacity = 0;
    setTimeout(function () {
      my.introElem.style.display = 'none';
    }, 300);
  }

  /**
   * Fetch data
   * Returns data as json
   * @returns {Promise} json
   */
  const getJson = async function () {
    const res = await fetch('./data/data.json');
    return res.json();
  }

  return my;
})({}, Sunburst, Fields, Projects);
