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
    cleanAside();

    if (Array.isArray(data.project) && data.project.length > 1) {
      return updateDataForSeveralProjects(data);
    }
    data.details[0] = linkify(data.details[0]);

    my.titleElem.innerHTML = data.name ? data.name : '';
    my.projectElem.innerHTML = data.project[0] ? data.project[0] : '';
    my.descriptionElem.innerHTML = data.description[0] ? data.description[0] : '';
    my.detailsElem.innerHTML = data.details[0] ? data.details[0] : '';  
  }

  const updateDataForSeveralProjects = function (data) {
    const dataLength = data.project.length;
    let i = 0;
    for (i; i < dataLength; i++) {
      data.details[i] = linkify(data.details[i]);

      my.projectElem.innerHTML = data.project[i] ? data.project[i] : '';
      my.descriptionElem.innerHTML = data.description[i] ? data.description[i] : '';
      my.detailsElem.innerHTML = data.details[i] ? data.details[i] : '';

      duplicateParagraphes();
    }

    my.titleElem.innerHTML = data.name ? data.name : '';
  }

  const duplicateParagraphes = function () {
    my.projectElem = my.projectElem.cloneNode();
    my.descriptionElem = my.descriptionElem.cloneNode();
    my.detailsElem = my.detailsElem.cloneNode();

    my.asideElem.appendChild(my.projectElem);
    my.asideElem.appendChild(my.descriptionElem);
    my.asideElem.appendChild(my.detailsElem);
  }

  const cleanAside = function () {
    my.asideElem.innerHTML = '';
    my.titleElem = my.titleElem.cloneNode();
    my.asideElem.appendChild(my.titleElem);
    my.asideElem.appendChild(my.projectElem);
    my.asideElem.appendChild(my.descriptionElem);
    my.asideElem.appendChild(my.detailsElem);
  }

  const linkify = function (text) {
    if (text.indexOf('<a') > -1) return text;
    return text.replace(URL_REGEX, function (url) {
      return '<a href="' + url + '">' + url + '</a>';
    });
  }

  return my;
})({});