/**
 * Created by Appoyy on 18/09/16.
 */
// Main Angular module
var app = angular.module('OnePush', []);

// Controller for the main Page
app.controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.data;
    $scope.pushData = {};

    $scope.checkForm = function () {
        return !$scope.pushData.title || !$scope.pushData.url || !$scope.pushData.tag ||
            $scope.pushData.title == '' || $scope.pushData.url == '' || $scope.pushData.tag == '';
    };

    $scope.pushData = function () {
        $http.post('https://hackerearth.0x10.info/api/one-push?type=json&query=push&title=' + $scope.pushData.title
            + '&url=' + $scope.pushData.url + '&tag=' + $scope.pushData.tag).then(function (res) {
            console.log(res);
            $scope.pushData = {};
        }, function (err) {
            console.log(err);
        });
    };

    $scope.getLike = function (id) {
        if (localStorage.getItem(id) == '1') {
            return "fa-thumbs-up";
        }
        return "fa-thumbs-o-up"
    };


    $scope.like = function (id) {
        if (localStorage.getItem(id) == '1') {
            localStorage.setItem(id, 0);
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
        $(document).ready(function () {
            $('.modal-trigger').leanModal();
        });
        //Initialize Auto Complete
        initAutoComplete();
    }, function (err) {
        Materialize.toast(err, 3000, "rounded")
    });

    $scope.search = function (row) {
        // Filter for Searching
        return (angular.lowercase(row.title).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
        angular.lowercase(row.url_address).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
        angular.lowercase(row.tag).indexOf(angular.lowercase($scope.query) || '') !== -1);
    };

}]);