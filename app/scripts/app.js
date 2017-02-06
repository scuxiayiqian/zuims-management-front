'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */
angular
  .module('sbAdminApp', [
    'oc.lazyLoad',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'smart-table',
    'ngCookies',
    'ngAnimate',
    'ngResource',
    'ngImgCrop',
    'ngDialog',
    'ngSanitize',
    'ngCsv',
    'angular-sortable-view'
  ])
    .constant('API', {
        /*USER: 'http://115.159.87.129:8001',
        RESTAURANT: 'http://115.159.87.129:8000',
        MERCHANT: 'http://115.159.87.129:8004',
        OPERATION: 'http://115.159.87.129:8008',
        DATA: 'http://115.159.87.129:8004'*/

        USER: 'http://123.206.181.47:8001',
        RESTAURANT: 'http://123.206.181.47:8000',
        MERCHANT: 'http://123.206.181.47:8004',
        OPERATION: 'http://123.206.181.47:8008',
        DATA: 'http://123.206.181.47:8004'
    })

    .constant('_',
        window._
    )

  .config(['$stateProvider','$urlRouterProvider','$ocLazyLoadProvider',function ($stateProvider,$urlRouterProvider,$ocLazyLoadProvider) {

    $ocLazyLoadProvider.config({
      debug:false,
      events:true
    });

    $urlRouterProvider.otherwise('/login');

    $stateProvider
      .state('dashboard', {
        url:'/dashboard',
        templateUrl: 'views/dashboard/main.html',
        resolve: {
            loadMyDirectives:function($ocLazyLoad){
                return $ocLazyLoad.load(
                {
                    name:'sbAdminApp',
                    files:[
                    'scripts/directives/header/header.js',
                    'scripts/directives/header/header-notification/header-notification.js',
                    'scripts/directives/sidebar/sidebar.js',
                    'scripts/directives/sidebar/sidebar-search/sidebar-search.js'
                    ]
                }),
                $ocLazyLoad.load(
                {
                   name:'toggle-switch',
                   files:["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                          "bower_components/angular-toggle-switch/angular-toggle-switch.css"
                      ]
                }),
                $ocLazyLoad.load(
                {
                  name:'ngAnimate',
                  files:['bower_components/angular-animate/angular-animate.js']
                }),
                $ocLazyLoad.load(
                {
                  name:'ngCookies',
                  files:['bower_components/angular-cookies/angular-cookies.js']
                }),
                $ocLazyLoad.load(
                {
                  name:'ngResource',
                  files:['bower_components/angular-resource/angular-resource.js']
                }),
                $ocLazyLoad.load(
                {
                  name:'ngSanitize',
                  files:['bower_components/angular-sanitize/angular-sanitize.js']
                }),
                $ocLazyLoad.load(
                {
                  name:'ngTouch',
                  files:['bower_components/angular-touch/angular-touch.js']
                })
            }
        }
    })
      .state('dashboard.home',{
        url:'/home',
        controller: 'MainCtrl',
        templateUrl:'views/dashboard/home.html',
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'sbAdminApp',
              files:[
              'scripts/controllers/main.js',
              'scripts/directives/timeline/timeline.js',
              'scripts/directives/notifications/notifications.js',
              'scripts/directives/chat/chat.js',
              'scripts/directives/dashboard/stats/stats.js'
              ]
            })
          }
        }
      })
      .state('dashboard.form',{
        templateUrl:'views/form.html',
        url:'/form'
    })
      .state('dashboard.blank',{
        templateUrl:'views/pages/blank.html',
        url:'/blank'
    })
      .state('login',{
        templateUrl:'views/pages/login.html',
        url:'/login',
        resolve: {
            loadMyFiles:function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name:'sbAdminApp',
                    files:[
                        'scripts/directives/keypress/ngEnter.js',
                        'scripts/controllers/login.js'
                    ]
                })
            }
        }
    })
    .state('signup',{
        templateUrl:'views/pages/signup.html',
        url:'/signup',
        controller: 'SignupController',
        resolve: {
            loadMyFiles:function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name:'sbAdminApp',
                    files:[
                        'scripts/controllers/login.js'
                    ]
                })
            }
        }
    })
      .state('dashboard.chart',{
        templateUrl:'views/chart.html',
        url:'/chart',
        controller:'ChartCtrl',
        resolve: {
          loadMyFiles:function($ocLazyLoad) {
            return $ocLazyLoad.load({
              name:'chart.js',
              files:[
                'bower_components/angular-chart.js/dist/angular-chart.min.js',
                'bower_components/angular-chart.js/dist/angular-chart.css'
              ]
            }),
            $ocLazyLoad.load({
                name:'sbAdminApp',
                files:['scripts/controllers/chartContoller.js']
            })
          }
        }
    })
      .state('dashboard.restaurant-promotion',{
        templateUrl:'views/restaurant-promotion.html',
        url:'/restaurant-promotion',
          resolve: {
              loadMyFiles:function($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name:'sbAdminApp',
                      files:[
                          'scripts/controllers/restaurant-promotion.js',
                          'scripts/directives/keypress/ngEnter.js'
                      ]
                  })
              }
          }
    })
        .state('dashboard.restaurant-info',{
            templateUrl:'views/restaurant-info.html',
            url:'/restaurant-info',
            resolve: {
                loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/restaurant-info.js',
                            'scripts/directives/keypress/ngEnter.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.city',{
            templateUrl:'views/city.html',
            url:'/city',
            resolve: {
                loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/city.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.production',{
            templateUrl:'views/production.html',
            url:'/production',
            resolve: {
                loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/production.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.carousel',{
            templateUrl:'views/carousel.html',
            url:'/carousel',
            resolve: {
                loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/carousel.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.right',{
            templateUrl:'views/right.html',
            url:'/right',
            resolve: {
                loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/right.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.role',{
            templateUrl:'views/role.html',
            url:'/role',
            resolve: {
                loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/role.js'
                        ]
                    })
                }
            }
        })
        .state('dashboard.account',{
            templateUrl:'views/account.html',
            url:'/account',
            resolve: {
                loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/account.js'
                        ]
                    })
                }
            }
        })

        .state('dashboard.user',{
            templateUrl:'views/user.html',
            url:'/user',
            resolve: {
                loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/user.js'
                        ]
                    })
                }
            }
        })

        .state('dashboard.vip',{
          templateUrl:'views/vip.html',
          url:'/vip',
          resolve:{
            loadMyFiles:function($ocLazyLoad) {
              return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:[
                  'scripts/controllers/vip.js'
                ]
              })
            }
          }
        })

        .state('dashboard.merchant',{
          templateUrl:'views/merchant.html',
          url:'/merchant',
          resolve: {
            loadMyFiles:function($ocLazyLoad) {
              return $ocLazyLoad.load({
                name:'sbAdminApp',
                files:[
                  'scripts/controllers/merchant.js'
                ]
              })
            }
          }
        })

        .state('dashboard.unconfirmedOrder',{
            templateUrl:'views/unfinishedOrder.html',
            url:'/unfinishedOrder',
            resolve: {
                loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/unfinishedOrder.js'
                        ]
                    })
                }
            }
        })

        .state('dashboard.confirmedOrder',{
            templateUrl:'views/confirmedOrder.html',
            url:'/confirmedOrder',
            resolve: {
                loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/confirmedOrder.js'
                        ]
                    })
                }
            }
        })

        .state('dashboard.finishedOrder',{
            templateUrl:'views/finishedOrder.html',
            url:'/finishedOrder',
            resolve: {
                loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/finishedOrder.js'
                        ]
                    })
                }
            }
        })

        .state('dashboard.reservation-quantity', {
            templateUrl: 'views/reservation-quantity.html',
            url:'/reservation-quantity',
            resolve: {
                loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'chart.js',
                        files:[
                            'bower_components/angular-chart.js/dist/angular-chart.min.js',
                            'bower_components/angular-chart.js/dist/angular-chart.css'
                        ]
                    }),
                        $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/reservation-quantity.js',
                            'scripts/directives/keypress/ngEnter.js'
                        ]
                    })
                }
            }
        })

        .state('dashboard.order-quantity', {
            templateUrl: 'views/order-quantity.html',
            url:'/order-quantity',
            resolve: {
                loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'chart.js',
                        files:[
                            'bower_components/angular-chart.js/dist/angular-chart.min.js',
                            'bower_components/angular-chart.js/dist/angular-chart.css'
                        ]
                    }),
                        $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/order-quantity.js',
                            'scripts/directives/keypress/ngEnter.js'
                        ]
                    })
                }
            }
        })

        .state('dashboard.repast-quantity', {
            templateUrl: 'views/repast-quantity.html',
            url:'/repast-quantity',
            resolve: {
                loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'chart.js',
                        files:[
                            'bower_components/angular-chart.js/dist/angular-chart.min.js',
                            'bower_components/angular-chart.js/dist/angular-chart.css'
                        ]
                    }), $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/repast-quantity.js',
                            'scripts/directives/keypress/ngEnter.js'
                        ]
                    })
                }
            }
        })

        .state('dashboard.orderRate', {
            templateUrl: 'views/orderRate.html',
            url:'/orderRate',
            resolve: {
                loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'chart.js',
                        files:[
                            'bower_components/angular-chart.js/dist/angular-chart.min.js',
                            'bower_components/angular-chart.js/dist/angular-chart.css'
                        ]
                    }), $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/orderRate.js',
                            'scripts/directives/keypress/ngEnter.js'
                        ]
                    })
                }
            }
        })

        .state('dashboard.repastRate', {
            templateUrl: 'views/repastRate.html',
            url:'/repastRate',
            resolve: {
                loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'chart.js',
                        files:[
                            'bower_components/angular-chart.js/dist/angular-chart.min.js',
                            'bower_components/angular-chart.js/dist/angular-chart.css'
                        ]
                    }), $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/repastRate.js',
                            'scripts/directives/keypress/ngEnter.js'
                        ]
                    })
                }
            }
        })

        .state('dashboard.restaurant-detail', {
            templateUrl: 'views/restaurant-detail.html',
            url:'/restaurant-detail',
            controller: 'ManagementCtrl',
            resolve: {
                loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/restaurant-detail.js'
                        ]
                    })
                }
            }
        })

        .state('dashboard.restaurant-create', {
            templateUrl: 'views/restaurant-create.html',
            url:'/restaurant-create',
            resolve: {
                loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/restaurant-create.js'
                        ]
                    })
                }
            }
        })

        .state('dashboard.hotel', {
            templateUrl: 'views/hotel.html',
            url:'/hotel',
            resolve: {
                loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/hotel.js'
                        ]
                    })
                }
            }
        })

        .state('dashboard.restaurantSort', {
            templateUrl: 'views/restaurantSort.html',
            url:'/restaurantSort',
            resolve: {
                loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/restaurantSort.js'
                        ]
                    })
                }
            }
        })

        .state('dashboard.userReservationRank', {
            templateUrl: 'views/userReservationRank.html',
            url:'/userReservationRank',
            resolve: {
                loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/userReservationRank.js'
                        ]
                    })
                }
            }
        })

        .state('dashboard.dataGathering', {
            templateUrl: 'views/dataGathering.html',
            url:'/dataGathering',
            resolve: {
                loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/dataGathering.js'
                        ]
                    })
                }
            }
        })

        .state('dashboard.profile', {
            templateUrl: 'views/profile.html',
            url:'/profile',
            resolve: {
                loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/profile.js',
                            'scripts/directives/pswcheck/pswcheck.js'
                        ]
                    })
                }
            }
        })

        .state('dashboard.createNewRestaurant', {
            templateUrl: 'views/createNewRestaurant.html',
            url:'/createNewRestaurant',
            controller: 'ManagementCtrl',
            resolve: {
                loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name:'sbAdminApp',
                        files:[
                            'scripts/controllers/createNewRestaurant.js',
                            'scripts/controllers/restaurant-detail.js'
                        ]
                    })
                }
            }
        })

        .state('dashboard.panels-wells',{
          templateUrl:'views/ui-elements/panels-wells.html',
          url:'/panels-wells'
      })
      .state('dashboard.buttons',{
        templateUrl:'views/ui-elements/buttons.html',
        url:'/buttons'
    })
      .state('dashboard.notifications',{
        templateUrl:'views/ui-elements/notifications.html',
        url:'/notifications'
    })
      .state('dashboard.typography',{
       templateUrl:'views/ui-elements/typography.html',
       url:'/typography'
   })
      .state('dashboard.icons',{
       templateUrl:'views/ui-elements/icons.html',
       url:'/icons'
   })
      .state('dashboard.grid',{
       templateUrl:'views/ui-elements/grid.html',
       url:'/grid'
   })
  }]);
