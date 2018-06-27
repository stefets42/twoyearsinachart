const URL_REGEX = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

/**
 * Sub-skills and skills info module.
 * handle the modale behaviors.
 */
const Projects = (function (my) {
  my.asideElem = document.querySelector('aside#projects');
  my.titleElem = document.querySelector('aside#projects h1');
  my.projectElem = document.querySelector('aside#projects p#project');
  my.descriptionElem = document.querySelector('aside#projects p#description');
  my.detailsElem = document.querySelector('aside#projects p#details');

  /**
   * Update modal's data with the given data.
   * @param {*} data 
   * @returns {void}
   */
  my.update = function (data) {
    if (!data.project) return;
    if (my.asideElem.style.opacity && my.asideElem.style.opacity != 0) {
      my.asideElem.style.opacity = 0;
    }

    
    setTimeout(function () {
      my.asideElem.style.opacity = 1;
      updateData(data)
    }, 200)

  }

  const updateData = function (data) {
    data.details = Array.isArray(data.details) ? data.details.join('<br><br>') : data.details;
    data.description = Array.isArray(data.description) ? data.description.join('<br><br>') : data.description;
    data.project = Array.isArray(data.project) ? data.project.join('<br><br>') : data.project;
    data.title = Array.isArray(data.title) ? data.title.join('<br><br>') : data.title;

    data.details = linkify(data.details)

    my.titleElem.innerHTML = data.name ? data.name : '';
    my.projectElem.innerHTML = data.project ? data.project : '';
    my.descriptionElem.innerHTML = data.description ? data.description : '';
    my.detailsElem.innerHTML = data.details ? data.details : '';  
  }

  const linkify = function (text) {
    console.log(text)
    return text.replace(URL_REGEX, function (url) {
      return '<a href="' + url + '">' + url + '</a>';
    });
  }

  return my;
})({});