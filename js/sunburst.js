/**
 * Sunburst module. 
 * Uses D3.js
 */
const Sunburst = (function (my) {
  my.width = 600;
  my.height = 600;
  my.radius = (Math.min(my.width, my.height) / 2);

  my.color = d3.scaleOrdinal(['#ff3800', '#3a3934', '#4ABDAC', '#F7B733']);
  // Prepare our physical space
  my.g = d3.select("section#sunburst")
          .append("div")
          .classed("svg-container", true)
          .append("svg")
          .attr("preserveAspectRatio", "xMinYMin meet")
          .attr("viewBox", "-300 -300 600 600")
          .append("g")
  // Declare d3 layout
  my.layout = d3.partition().size([2 * Math.PI, my.radius]);
  my.arc = d3.arc()
      .startAngle(function (d) { return d.x0; })
      .endAngle(function (d) { return d.x1; })
      .innerRadius(function (d) { return d.y0; })
      .outerRadius(function (d) { return d.y1; });
  my.path = null;
  my.slices = null;
  my.data = {
    name: '',
    children: []
  };
  my.fields = [];
  my.subSkills = [];

  /**
   * Creates the sunburst plot with the given data.
   * @param {*} data 
   */
  my.vroum = function (data) {
    processData(data);

    const root = d3.hierarchy(my.data).sum(function (d) { return d.size});
    const nodes = root.descendants();
    my.layout(root);
    my.slices = my.g.selectAll('g').data(nodes).enter().append('g');
    my.path = my.slices.append('path')
            .attr('display', function (d) { return d.depth ? null : 'none'; })
            .attr('d', my.arc)
            .style('stroke', '#fff')
            .style('fill', function (d) { return my.color((d.children ? d : d.parent).data.name); });

    const strokes =  my.slices.append("text")
      .text(function (d) {
        return d.parent ? d.data.name : ''; 
      })
      .attr('transform', function(d) {
        const translateValues = my.arc.centroid(d);
        return 'translate(' + translateValues + ')rotate(' + computeTextRotation(d) + ')'; 
      })
      .attr('dx', '0')
      .attr('dy', '0')
      .style("font-size", ".8rem")
      .style("font-weight", "700")
      .style('fill', 'none')
      .style('stroke', 'rgba(0, 0, 0, .2)')
      .style('stroke-width', 5)
      .style('stroke-linejoin', 'round');
    
    const text =  my.slices.append("text")
      .text(function (d) {
        return d.parent ? d.data.name : ''; 
      })
      .attr('transform', function(d) {
        const translateValues = my.arc.centroid(d);
        return 'translate(' + translateValues + ')rotate(' + computeTextRotation(d) + ')'; 
      })
      .attr('dx', '0')
      .attr('dy', '0')
      .style("font-size", ".8rem")
      .style("font-weight", "700")
      .style("fill", "#fff")

    wrap(text, 60)
    wrap(strokes, 60)

    // Run interactions with the chart
     my.slices.on('click', function (d) {
      Projects.update(d.data);
    });
    Fields.vroum(my);
  }

  /**
   * Calls all data processing methods
   * @param {*} data 
   */
  const processData = function (data) {
    processfields(data);
    processSkillBlocs(data);
    processSkills(data);
  }

  /**
   * Creates the fields dataset
   * @param {*} data 
   */
  const processfields = function (data) {
    data.forEach(function (row) {
      const fieldName = row.field;
      if (!my.fields.includes(fieldName)) {
        my.fields.push(fieldName);
      }
    });
  }

  /**
   * Adds skill blocs to the first level of depth
   * @param {*} data 
   */
  const processSkillBlocs = function (data) {
    data.forEach(function (row) {
      const blocName = row.skill1;
      let size = 0;
      let children = [];

      if (itContainsElemByName(my.data.children, blocName) === -1) {
        my.data.children.push({ name: blocName, size: size, children: children });
      }
    });
  }

  /**
   * Adds skills to the second level of depth
   * @param {*} data 
   */
  const processSkills = function (data) {
    data.forEach(function (row) {
      const skillName = row.skill2;
      const skillBloc = row.skill1;
      const field = row.field;
      const project = row.project;
      const description = row.description;
      const details = row.details;

      let size = 2;

      let skillBlocIndex = my.data.children.findIndex(function (bloc) {
        return bloc.name == skillBloc;
      });
      let skillBlocSkills = my.data.children[skillBlocIndex].children;
      let existingSkillIndex = itContainsElemByName(skillBlocSkills, skillName);
      let existingSkill = skillBlocSkills[existingSkillIndex];
      
      if (existingSkillIndex > -1) {
        existingSkill.size = existingSkill.size * 2
        existingSkill.project.push(project);
        existingSkill.field.push(field);
        existingSkill.description.push(description);
        existingSkill.details.push(details);
        return;
      }
      

      my.data.children[skillBlocIndex].children.push({ 
        name: skillName, 
        size: size,
        project: [project],
        field: [field],
        description: [description],
        details: [details]
      });
    });
  }

  /**
   * Returns wether dataset already contains the given elem by its name
   * @param {String} elemName 
   */
  const itContainsElemByName = function (it, elemName) {
    return it.findIndex(function (elem) {
      return elem.name == elemName;
    });
  }

  /**
   * Calcs rotation value for the given d
   * @param {*} d 
   */
  const computeTextRotation = function (d) {
    const angle = (d.x0 + d.x1) / Math.PI * 90;
    return (angle < 90 || angle > 270) ? angle - 9 : angle + 180;
  }

  /**
   * Wrap words
   * @param {String} text 
   * @param {Number} width 
   */
  function wrap(text, width) {
    const lineHeight = 1; // ems
    
    text.each(function() {
      const text = d3.select(this);
      const words = text.text().split(/\s+/).reverse();
      const y = text.attr("y");
      const dy = parseFloat(text.attr("dy"));
      
      let tspan = text.text(null).append("tspan")
        .attr("x", -35)
        .attr("y", y)
        .attr("dy", dy + "em");
      let line = [];
      let word;
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan")
            .attr("x", -35)
            .attr("y", y)
            .attr("dy", lineHeight + "em")
            .text(word);
        }
      }
    });
  }

  return my;
})({}, Fields, Projects);