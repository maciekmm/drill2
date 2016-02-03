var drillApp;

drillApp = angular.module('DrillApp');

drillApp.filter('decPlaces', function() {
  return function(x, dec) {
    var pow;
    pow = Math.pow(10, dec);
    return (Math.round(x * pow)) / pow;
  };
});

drillApp.filter('markdown', [
  '$sce', function($sce) {
    return function(str, $scope) {
      var ast, fix, html, parser, renderer;
      if (!(str && $scope.config.markdown)) {
        return '';
      }
      parser = new commonmark.Parser();
      renderer = new commonmark.HtmlRenderer();
      ast = parser.parse(str);
      fix = function(node) {
        var i, j, ref, split, wanted;
        if (node._type === 'CodeBlock') {
          str = node._literal;
          if (node._isFenced) {
            str = str.substring(1, str.length - 1);
          }
          split = str.split('\n');
          wanted = [];
          for (i = j = 0, ref = split.length; j < ref; i = j += 2) {
            wanted.push(split[i]);
          }
          node._literal = wanted.join('\n');
        } else {
          if (node._firstChild) {
            fix(node._firstChild);
          }
          if (node._next) {
            fix(node._next);
          }
        }
      };
      fix(ast);
      html = renderer.render(ast);
      return $sce.trustAsHtml(html);
    };
  }
]);

drillApp.filter('lines', function() {
  return function(str) {
    if (str) {
      return str.split(/\s*(?:\r?\n)(?:\r?\n\s)*/);
    } else {
      return [];
    }
  };
});

drillApp.filter('doubleNewlines', function() {
  return function(str) {
    if (str) {
      return str.replace(/\n+/g, '\n\n');
    } else {
      return '';
    }
  };
});

drillApp.filter('minutes', function() {
  return function(secs) {
    var mins;
    if (!secs) {
      return '';
    }
    secs = parseInt(secs);
    mins = Math.floor(secs / 60);
    secs = (secs % 60).toString();
    while (secs.length < 2) {
      secs = '0' + secs;
    }
    return mins + ":" + secs;
  };
});

drillApp.filter('minsSecs', function() {
  return function(secs) {
    var mins, mstr;
    mins = Math.floor(secs / 60);
    mstr = mins > 0 ? mins + 'm ' : '';
    return mstr + (secs % 60) + 's';
  };
});

drillApp.filter('scoreFormat', [
  'decPlacesFilter', 'minsSecsFilter', function(decPlacesFilter, minsSecsFilter) {
    return function(score, limitedTime, timeLimit) {
      var score_, str, total;
      score_ = decPlacesFilter(score.score, 2);
      total = decPlacesFilter(score.total, 2);
      str = score_ + " / " + total + " pts";
      if (limitedTime) {
        str += ', ' + minsSecsFilter(timeLimit - score.timeLeft);
      }
      return str;
    };
  }
]);

drillApp.filter('no', function() {
  return function(x, capitalized) {
    return x != null ? x : capitalized ? 'No' : 'no';
  };
});

drillApp.filter('averageTime', function() {
  return function(questions, timeLimit) {
    var count, j, k, len, len1, log, question, ref, total;
    count = 0;
    total = 0;
    for (j = 0, len = questions.length; j < len; j++) {
      question = questions[j];
      count += question.scoreLog.length;
      ref = question.scoreLog;
      for (k = 0, len1 = ref.length; k < len1; k++) {
        log = ref[k];
        total += timeLimit - log.timeLeft;
      }
    }
    return Math.round(total / count);
  };
});
