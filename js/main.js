/**
 * Created by Appoyy on 18/09/16.
 */
// Main Angular module
var app = angular.module('OnePush', []);

// Controller for the main Page
app.controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.data;
    $scope.search = {query: '', sortField: ''};
    $scope.pushData = {};
    $('#preLoad').openModal();


    $scope.checkForm = function () {
        // Form Validation
        return !$scope.pushData.title || !$scope.pushData.url || !$scope.pushData.tag ||
            $scope.pushData.title == '' || $scope.pushData.url == '' || $scope.pushData.tag == '';
    };

    $scope.pushData = function () {
        // Push Function

        $('#preLoad').openModal();
        $http.get('https://hackerearth.0x10.info/api/one-push?type=json&query=push&title=' +
            $scope.pushData.title + '&url=' + $scope.pushData.url + '&tag=' + $scope.pushData.tag)
            .then(function (res) {
                // Success Callback
                $('#preLoad').closeModal();
                console.log(res);
                $scope.pushData = {};
            }, function (err) {
                // Error Callback
                $('#preLoad').closeModal();
                console.log(err);
            });
    };

    $scope.getLike = function (id) {
        // Check Liked Status and return corresponding icon
        if (localStorage.getItem(id) == '1') {
            return "fa-thumbs-up";
        }
        return "fa-thumbs-o-up"
    };


    $scope.like = function (id) {
        // Set / Reset Like
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
        });

        // Render elements in object format for autocomplete
        dataList = _.object(dataList, [null]);

        // Autocomplete
        $(document).ready(function () {
            $('input.autocomplete').autocomplete({
                data: dataList,
                disabled: true
            });

            $('.autocomplete-content').on('click', 'li', (function () {
                var selectedText = $(this).text();
                $scope.$apply(function () {
                    $scope.search.query = selectedText;
                });
            }));
        })
    }

    $http.get('https://hackerearth.0x10.info/api/one-push?type=json&query=list_websites').then(function (res) {
        $('#preLoad').closeModal();
        // Data from the API Request
        $scope.data = res.data;

        $(document).ready(function () {
            // Initialize Modal Trigger
            $('.modal-trigger').leanModal();
            // Init Tooltip
            $('.tooltipped').tooltip({delay: 50});
            // Init Select
            $('select').material_select();
        });
        $('#sortSel').change(function () {
            var sel = $(this).val();
            $scope.$apply(function () {
                $scope.search.sortField = sel;
            });

        });
        //Initialize Auto Complete
        initAutoComplete();
    }, function (err) {
        $('#preLoad').closeModal();
        Materialize.toast(err, 3000, "rounded");
    });

    $scope.sortOpts = ['title', 'web_address', 'tag'];

    $scope.search = function (row) {
        // Filter for Searching
        return (angular.lowercase(row.title).indexOf(angular.lowercase($scope.search.query) || '') !== -1 ||
        angular.lowercase(row.url_address).indexOf(angular.lowercase($scope.search.query) || '') !== -1 ||
        angular.lowercase(row.tag).indexOf(angular.lowercase($scope.search.query) || '') !== -1);
    };

}]);