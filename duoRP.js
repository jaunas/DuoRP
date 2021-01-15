$.get("2017-06-30/users/22745878?fields=xpGains,currentCourse", function(data) {
  processResponse(data);
});

function processResponse(data) {
  data = processData(data);

  var xpProgress = $("h2:contains('XP Progress')").first().parent().parent();
  xpProgress.after(buildRecentXpDiv(data['xpGains'], xpProgress[0].className));
}

function processData(data) {
  var skills = data['currentCourse']['skills'].flat();

  data['xpGains'].forEach((item) => {
    var skill = skills.find(skill => {
      return skill.id === item['skillId'];
    });

    item['skill'] = skill;
    if (skill) {
      skill['xpGains'] = skill['xpGains'] || [];
      skill['xpGains'].push(item);
    }
  });

  var xpGains = data['xpGains'];

  return {
    skills: skills,
    xpGains: xpGains
  }
}

function buildRecentXpTable(xpGains) {
  var rows = '<tr><th>Time</th><th>XP</th><th>Lesson</th></tr>';
  xpGains.reverse();
  xpGains.forEach((item) => {
    var row = '<tr>';
    row += '<td>' + getTimeFromTimestamp(item['time']) + '</td>';
    row += '<td>' + item['xp'] + '</td>';
    row += '<td>' + (item['skill'] ? item['skill']['shortName'] : 'Practice') + '</td>';
    row += '</tr>';

    rows += row;
  });

  return '<table>' + rows + '</table>';
}

function buildRecentXpDiv(xpGains, className) {
  var div = '<div class="' + className + '">';
  div += buildRecentXpTable(xpGains);
  div += '</div>';

  return div;
}

function getTimeFromTimestamp(timestamp) {
  var date = new Date(timestamp * 1000);
  return date.toLocaleString();
}
