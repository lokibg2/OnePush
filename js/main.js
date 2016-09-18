/**
 * Created by Appoyy on 18/09/16.
 */
// Main Angular module
var app = angular.module('OnePush', []);

// Controller for the main Page
app.controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.data;
    $scope.liked = [];
    $scope.likeCount = [];

    $scope.getLike = function (id) {
        if (localStorage.getItem(id) && localStorage.getItem(id) > 0) {
            return "fa-thumbs-up";
        }
        return "fa-thumbs-o-up"
    };

    $scope.getLikeCount = function (id) {
        return localStorage.getItem(id) ? localStorage.getItem(id) : 0;
    };

    $scope.like = function (id) {
        if (localStorage.getItem(id)) {
            if (localStorage.getItem(id) >= 0) {
                localStorage.setItem(id, Number(localStorage.getItem(id)) + 1);
            } else {
                localStorage.setItem(id, Number(localStorage.getItem(id)) - 1);
            }
        } else {
            localStorage.setItem(id, 1);
        }
    };

    function initAutoComplete() {
        dataList = []

        //Pick required filter fields' values from the data set
        _.map($scope.data.websites, function (i) {
            dataList.push(_.values(_.pick(i, 'tag', 'title', 'url_address')))
        });

        // Merge values into a single array
        dataList = _.flatten(dataList);

        // Convert elements to lowercase
        dataList = _.map(dataList, function (i) {
            return i.toLowerCase();
        })

        // Render elements in object format for autocomplete
        dataList = _.object(dataList, [null]);

        // Autocomplete
        $(document).ready(function () {
            $('input.autocomplete').autocomplete({
                data: dataList
            });
        })
    }

    $http.get('https://hackerearth.0x10.info/api/one-push?type=json&query=list_websites').then(function (res) {
        // Data from the API Request
        $scope.data = res.data;

        //Initialize Auto Complete
        initAutoComplete();
    });

    $scope.search = function (row) {
        // Filter for Searching
        return (angular.lowercase(row.title).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
        angular.lowercase(row.url_address).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
        angular.lowercase(row.tag).indexOf(angular.lowercase($scope.query) || '') !== -1);
    };

}]);