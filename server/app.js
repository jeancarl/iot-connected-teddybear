angular.module('moodChartsApp', ['chart.js','ngSanitize'])
.controller('moodChartsCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.moods = [];
  $scope.emoticons = {
    "Joy": "&#x1F600;",
    "Fear": "&#x1F628;",
    "Anger": "&#x1F620;",
    "Disgust": "&#x1f62C;",
    "Sadness": "&#x1F62A;"    
  };

  $http.get('http://outsideinhack.mybluemix.net/childMoods').then(function(response) {
    $scope.moods = response.data;

    var moods = {};
    for(var i in $scope.moods) {
      if(!($scope.moods[i].emotion in moods))
        moods[$scope.moods[i].emotion] = 0;

      moods[$scope.moods[i].emotion]++;
    }

    $scope.labels = [];
    $scope.data = [];
    for(var i in moods)
    {
      $scope.labels.push(i);
      $scope.data.push(moods[i]);
    }
    console.log(moods);
  });
}]);
