/**
 * Fields module.
 * Handles the fields aside (navigation).
 */
const Fields = (function (my) {
  my.data = [];
  my.fieldElem = document.querySelector('aside#fields');
  my.navElem = my.fieldElem.querySelector('nav ul');
  my.cleanUpButton = document.querySelector('button#cleanFilters');

  /**
   * Creates the modal. Sets up default state.
   * Registers onclick events (open/close the modal).
   * @param {sunburstChart} sunburstChart
   * @returns {void}
   */
  my.vroum = function (sunburstChart) {
    my.data = sunburstChart.fields
    
    makeNav(sunburstChart);
    
    my.cleanUpButton.style.display = 'block';
    my.cleanUpButton.onclick = my.cleanUp(sunburstChart);
  };

  /**
   * Iterates over all the field available.
   * Then, create clicable navigation elements.
   * Registers onclick events.
   * @param {*} sunburstChart
   * @returns {void}
   */
  const makeNav = function (sunburstChart) {
    my.data.forEach(function (field) {
      const li = document.createElement('li');
      li.innerText = field;
      li.onclick = fieldOnclick(sunburstChart, field);
      my.navElem.appendChild(li);
    });
  };

  /**
   * field onclick event handler
   * @param {sunburstChart} sunburstChart 
   * @param {String} cert 
   */
  const fieldOnclick = function (sunburstChart, field) {
    return function (e) {
      const li = e.target;
      const validPath = [];

      cleanActiveClass();

      li.className = 'active';
      sunburstChart.path.attr('opacity', 0.2);
      sunburstChart.path
        .each(function(d) {
          if (d.data.field && d.data.field.indexOf(field) > -1) {
            let ancestors = d.ancestors();
            ancestors.forEach(function (ancestor) {
              validPath.push(ancestor)
            });
          }
        })
        .filter(function(d) {
          return validPath.indexOf(d) > -1;
        })
        .attr('opacity', function(d) {
          return 1;
        });
    }
  };

  /**
   * Util function. Clean class attributes of all field.
   * @returns {void}
   */
  const cleanActiveClass = function () {
    const lis = document.querySelectorAll('nav ul li');
    lis.forEach(function (li) {
      li.className = '';
    })
  };

  my.cleanUp = function (sunburstChart) { return function () {
    cleanActiveClass()
    sunburstChart.path.attr('opacity', 1);
  }};

  return my;
})({});
