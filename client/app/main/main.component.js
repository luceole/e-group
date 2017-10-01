'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import modal from 'angular-ui-bootstrap/src/modal';
import routing from './main.routes';


export class NoteComponent {
  /*@ngInject*/
  constructor(Group, Auth, $uibModalInstance, grp) {
    //'ngInject';

    this.groupe = new Group(grp)

    this.Auth = Auth;
    this.options = {
      language: 'fr',
      // uiColor: "#66AB16",
      readOnly: true,
      width: '98%',
      height: 400
    };

    this.isAdmin = Auth.isAdmin;
    this.isAdmin_grp = Auth.isAdmin_grp;
    this.$uibModalInstance = $uibModalInstance;
    this.msg = "Un Message";
  }

  isAdminOf(grp) {
    console.log(grp);
    return this.Auth.getCurrentUserSync().adminOf.find(o => o._id === grp._id)
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  };

  save() {

    this.Auth.updateGroup(this.groupe._id, this.groupe)
      .then((r) => {
        this.$uibModalInstance.close();
      })
      .catch((err) => {
        console.log(err)
        this.msg = "Erreur :" + err.data;
      });
  };


}

export class MainController {
  /* @ngInject */
  constructor($http, $scope, $state, $stateParams, $window, socket, $uibModal, Auth, Group) {

    this.$http = $http;
    this.socket = socket;
    this.Auth = Auth;
    this.Group = Group;
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.isActif = Auth.isActif;
    this.$uibModal = $uibModal;
    this.OauthActif = true;
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  }

  openNote(grp) {
    this.$uibModal.open({
      templateUrl: 'modalNote.html',
      controller: NoteComponent,
      controllerAs: "NC",
      resolve: {
        grp: function () {
          return grp;
        }
      }
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
