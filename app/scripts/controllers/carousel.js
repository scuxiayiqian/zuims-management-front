/**
 * Created by shiyunfeng on 1/24/17.
 */

'use strict';

angular.module('sbAdminApp')
    .directive('changePic', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr, ctrl) {
                element.bind('click', function () {
                    var imageList = angular.element(document.querySelector('#d-img'));
                    imageList.attr("src", attr.src);
                    scope.$apply(function () {
                        var description = angular.element(document.querySelector('#description'));
                        description.text(attr.description);
                    });
                });
            }
        };
    })
    .factory('ManageService', ['$http', '$cookies', 'API', function ($http, $cookies, API) {
        //console.log(API);
        var restaurantBaseUrl = API.MERCHANT;
        //var managementBaseUrl = API.OPERATION;

        var token = $cookies.get('token');

        var getCarouselRequest = function() {
            return $http({
                method: 'GET',
                url: restaurantBaseUrl + '/carousel/getAll'
            });
        };

        var uploadCarouselRequest = function(imageInfo) {
            return $http({
                method: 'POST',
                url: restaurantBaseUrl + '/carousel/add',
                data: imageInfo,
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        };

        var editCarouselRequest = function(imageInfo) {
            return $http({
                method: 'POST',
                url: restaurantBaseUrl + '/carousel/edit',
                data: imageInfo,
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true
            });
        };

        var deleteCarouselRequest = function(cid) {
            return $http({
                method: 'POST',
                url: restaurantBaseUrl + '/carousel/delete',
                data: cid,
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain: true 
            })
        }

        return {
            getCarousel: function() {
                return getCarouselRequest();
            },
            uploadCarousel: function(imageInfo) {
                return uploadCarouselRequest(imageInfo);
            },
            editCarousel: function(imageInfo) {
                return editCarouselRequest(imageInfo);
            },
            deleteCarousel: function(cid) {
                return deleteCarouselRequest(cid);
            }
        } 

    }])

    .controller('CarouselCtrl', function ($scope, $location, $anchorScroll, ManageService, ngDialog, $cookies, API) {
        $scope.uploadCarouselShow = false;
        $scope.myCarouselCroppedPic = '';
        $scope.myCarouselImage = '';
        $scope.carouselPicDescription = '';
        $scope.carouselPicURL = '';
        $scope.carouselPicShow = true;
        $scope.index = 0;

        var handleFileSelect = function (evt) {

            var target = (evt.currentTarget) ? evt.currentTarget : evt.srcElement;

            var file = target.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function ($scope) {
                    $scope.myCarouselImage = evt.target.result;
                });
            };
            reader.readAsDataURL(file);
            $scope.uploadCarouselShow = true;

        };

        angular.element(document.querySelector('#InputListImage')).on('change', handleFileSelect);
        $scope.uploadPic = function () {
            $scope.begin = $scope.myCarouselCroppedPic.indexOf("base64") + 7;
            $scope.myUploadPic = $scope.myCarouselCroppedPic.substr($scope.begin);

            $scope.uploadPicInfo = {
                "cid": 0,
                "imageValue": $scope.myUploadPic,
                "description": $scope.carouselPicDescription,
                "cHref": $scope.carouselPicURL,
                "isShow": 0
            };

            if($scope.carouselPicShow == false) {
                $scope.uploadPicInfo.isShow = 0;
            }
            else if($scope.carouselPicShow == true) {
                $scope.uploadPicInfo.isShow = 1;
            }

            $scope.uploadInfo = JSON.stringify($scope.uploadPicInfo);
            ManageService.uploadCarousel($scope.uploadInfo)
                .success(function (data, status) {
                    alert("图片上传成功!");
                    $scope.carouselPicDescription = "";
                    $scope.uploadCarouselShow = false;
                });
        };

        $scope.removePic = function() {
            $scope.uploadCarouselShow = false;
            $scope.myCarouselImage = '';
            $scope.carouselPicDescription = '';
            $scope.myCarouselCroppedPic = '';

        };

        $scope.previewCarousel = function(){
            ManageService.getCarousel()
                .success(function(data){
                    $scope.listPic = data;
                    ngDialog.open({
                        templateUrl: 'previewCarousel.html',
                        scope: $scope
                    });
                })
        }

        function getBase64Image(img) {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
            var dataURL = canvas.toDataURL("image/"+ext);
            return dataURL;
        }

        $scope.editCarousel = function(pic) {
            var img = new Image();
            img.crossOrigin = '';
            img.src = pic.pUrl;
            img.onload = function(){
                var base64 = getBase64Image(img).substring(22);
                var editPicInfo = {
                    "cid": pic.cid,
                    "imageValue": base64,
                    "description": pic.description,
                    "cHref": pic.cHref,
                    "isShow": pic.isShow
                };

                var editInfo = JSON.stringify(editPicInfo);
                ManageService.editCarousel(editInfo)
                    .success(function(data){
                        alert("图片修改成功！");
                    })
            };
        }

        $scope.deleteCarousel = function(cid) {
            ManageService.deleteCarousel(cid)
                .success(function(data){
                    alert("图片删除成功！");
                })
        }

        $scope.frontCarousel = function() {
            if($scope.index == 0) {
                alert("已经是第一张了!");
            }
            else {
                $scope.index--;
            }
        }

        $scope.backCarousel = function() {
            if(($scope.index) == $scope.listPic.length - 1) {
                alert("已经是最后一张了！");
            }
            else {
                $scope.index++;
            }
        }

    });