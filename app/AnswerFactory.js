var app;

app = angular.module('DrillApp');

app.factory('AnswerFactory', function() {
  return {
    createAnswer: function(body, correct, id) {
      var Answer;
      Answer = function(body, correct, id) {
        this.body = body.trim();
        this.id = id;
        this.correct = !!correct;
        this.checked = false;
        this.append = function(line) {
          return this.body += '\n\n' + line.trim();
        };
      };
      return new Answer(body, correct, id);
    }
  };
});
