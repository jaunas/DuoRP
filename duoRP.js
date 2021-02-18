$.get("2017-06-30/users/22745878?fields=xpGains,currentCourse", function(data) {
  processResponse(data);
});

function processResponse(data) {
  data = parseData(data);

  addTableWithRecentXP(data.xpGains);
  addColorMarksToCircles(data.skills);
}

function parseData(data) {
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

// Recent XP table

function addTableWithRecentXP(xpGains) {
  var $xpProgress = $("h2:contains('XP Progress')").first().parent().parent();
  $xpProgress.after(buildRecentXpDiv(xpGains, $xpProgress[0].className));

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

// Color marks on circles

function addColorMarksToCircles(skills) {
  $("div[data-test='skill-icon']").each(function() {
    var $circle = $(this).parent();
    var label = $circle.parent().parent().children().last().text();

    var skill = skills.find(element => element.shortName == label);
    if (skill['finishedLevels'] < skill['levels'] && skill['xpGains']) {
      var lastGain = skill['xpGains'].slice(-1)[0];
      var days = dateDiffInDays(new Date(lastGain.time * 1000));

      var color = 'red';
      if (days == 0) {
        color = 'green';
      } else if (days == 1) {
        color = 'yellow';
      } else if (days == 2) {
        color = 'orange';
      }

      $circle.prepend('<div class="circle ' + color + '"></div>');
    }
  });
}

// Helpers

function getTimeFromTimestamp(timestamp) {
  var date = new Date(timestamp * 1000);
  return date.toLocaleString();
}

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

function dateDiffInDays(a, b) {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  var b = new Date();
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}
