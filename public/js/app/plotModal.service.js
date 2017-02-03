'use strict';
(function() {
  angular.module('app')
  .service('plotModal', function() {
    this.getModal = function($http, ModalService, plot_id, gardenService) {
      ModalService.showModal({
        templateUrl: "js/garden/modal_plot.html",
        controller: function ($scope, $element, close) {
          // $scope.singlePlot = {};

          $http.get('/api/plots/'+plot_id).then(function(result) {
            $scope.singlePlot = result.data;
            // console.log("plot data", result.data);
            $http.get('/api/producePlots/'+plot_id).then(function(pData) {
              // console.log("produce data", pData.data);
              $scope.singlePlot.produce = [];
              for (var i = 0; i < pData.data.produce.length; i++) {
                // populate an array of key value pairs from the array of produce
                $scope.singlePlot.produce.push(pData.data.produce[i]);
              }
            });
          });

          // TODO check if the UID matches the plot user id

          $scope.removeProduce = function(produce_id) {
            $http.delete(`/api/producePlots/${plot_id}/${produce_id}`).then(function(result) {
              // Update list in modal view
              $http.get(`/api/producePlots/${plot_id}`).then(function(updatedProduce) {
                $scope.singlePlot.produce = updatedProduce.data.produce;
                updateMap(plot_id);
              });
            });
          };

          function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
          }

          $scope.addProduce = function() {
            // Any food item should be set to uppercase
            $scope.newProduce = capitalize($scope.newProduce);
            // Check produce DB to see if produce exists, if not add default produce url
            $http.get(`/api/produce`).then(function(result) {
              let newProduce = {};
              for (var i = 0; i < result.data.length; i++) {
                if (result.data[i].produce_name === $scope.newProduce) {
                  newProduce = {
                    produce_name: $scope.newProduce,
                    produce_image_url: result.data[i].produce_image_url,
                    produce_id: result.data[i].id,
                    plot_id: plot_id
                  };
                }
              }

              // If new produce is not populate, populate it now
              if (!newProduce.produce_name) {
                newProduce = {
                  produce_name: $scope.newProduce,
                  produce_image_url: "../../assets/icons/other_icon.svg",
                  color: "6CAD73"
                };
                // Add it to the produce table
                $http.post('/api/produce', newProduce).then(function(result) {
                  // create object with produce ID and plot ID
                  newProduce.produce_id = result.data[0].id;
                  newProduce.plot_id = plot_id;
                  $http.post('/api/producePlots', newProduce).then(function(pResult) {
                    // Update list in modal view
                    $http.get(`/api/producePlots/${plot_id}`).then(function(updatedProduce) {
                      $scope.singlePlot.produce = updatedProduce.data.produce;
                      // console.log("new produce item: ", $scope.singlePlot.produce);
                      $scope.newProduce = "";
                      updateMap(plot_id);
                    });
                  });
                });
              }
              else {
                $http.post('/api/producePlots', newProduce).then(function(result) {
                  $http.get(`/api/producePlots/${plot_id}`).then(function(updatedProduce) {
                    $scope.singlePlot.produce = updatedProduce.data.produce;
                    // console.log("produce already exists: ", $scope.singlePlot.produce);
                    $scope.newProduce = "";
                    updateMap(plot_id);
                  });
                });
              }
            });


          };

          $scope.myClose = function(result){
            $element.modal('hide');
            close(null, 500);
          };
        }
      }).then(function(modal) {
        modal.element.modal();
        modal.close.then(function(result) {
          console.log("exit");
        });
      });

      function updateMap(plot_id) {
        gardenService.updateSinglePlot($http, 'centennial_garden', plot_id);
      }
    };
  });
}());


//
