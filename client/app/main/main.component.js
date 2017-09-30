import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {

  /*@ngInject*/
    constructor($http, $scope, $state, $stateParams, $window, socket, Auth) {

    this.$http = $http;
    this.socket = socket;
    this.Auth = Auth;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.OauthActif=true;
    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  }
}

export default angular.module('eCommunautApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
