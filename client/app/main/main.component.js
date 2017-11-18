'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import modal from 'angular-ui-bootstrap/src/modal';


import routing from './main.routes';

export class NoteComponent {
  /*@ngInject*/
  constructor(Group, Auth, $uibModalInstance, grp) {
    //'ngInject';
    this.groupe = grp;
    this.Auth = Auth;

    this.options = {
      language: 'fr',
      // uiColor: "#66AB16",
      //readOnly: true,
      width: '98%',
      height: 400
    };
    //  moment.locale('fr');
    this.isAdmin = Auth.isAdmin;
    this.isAdmin_grp = Auth.isAdmin_grp;
    this.isAdminOf = this.Auth.getCurrentUserSync().adminOf.find(o => o._id === this.groupe._id);
    this.$uibModalInstance = $uibModalInstance;
    this.msg = "";
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
        this.msg = "Erreur :" + err.statusText;
      });
  };
}

export class MainController {
  /* @ngInject */
  constructor($http, $scope, $state, $stateParams, $cookies, $window, socket, appConfig, $uibModal, calendarConfig, moment, Auth, Group) {
    this.$http = $http;
    this.$cookies = $cookies;
    this.$window = $window;
    this.socket = socket;
    this.Auth = Auth;
    this.Group = Group;
    this.calendarView = 'month';
    this.viewDate = new Date();
    //this.viewDate = moment().startOf('month').toDate();

    calendarConfig.dateFormatter = 'moment'; // use moment instead of angular for formatting dates
    var originali18n = angular.copy(calendarConfig.i18nStrings);
    calendarConfig.i18nStrings.weekNumber = 'Semaine {week}';
    moment.locale('fr'); // change the locale to french
    //calendarConfig.templates.calendarMonthCell = 'groupedMonthEvents.html';

    var actions = [{
      label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
      onClick: function(args) {
        alert('Edited', args.calendarEvent);
      }
    }, {
      label: '<i class=\'glyphicon glyphicon-remove\'></i>',
      onClick: function(args) {
        alert('Deleted', args.calendarEvent);
      }
    }];
    this.events = [{
        title: 'Evenement de test!', // The title of the event
        startsAt: new Date(2017, 10, 10, 10), // A javascript date object for when the event starts
        endsAt: new Date(2017, 10, 10, 11), // Optional - a javascript date object for when the event ends
        draggable: true, //Allow an event to be dragged and dropped
        resizable: true, //Allow an event to be resizable
        allDay: false, // set to true to display the event as an all day event on the day view
        actions: actions,

        color: calendarConfig.colorTypes.warning,
      },
      {
        title: 'Evenement  2 test reda only!', // The title of the event
        startsAt: new Date(2017, 10, 10, 16), // A javascript date object for when the event starts
        endsAt: new Date(2017, 10, 10, 18), // Optional - a javascript date object for when the event ends
      //  draggable: true, //Allow an event to be dragged and dropped
        //resizable: true, //Allow an event to be resizable
        allDay: false, // set to true to display the event as an all day event on the day view
          color: calendarConfig.colorTypes.error,
           type: 'warning'
      //  actions: actions,
    },
    {
      title: 'Evenement  3 test read only!', // The title of the event
      startsAt: new Date(2017, 10, 10, 12), // A javascript date object for when the event starts
      endsAt: new Date(2017, 10, 10, 13), // Optional - a javascript date object for when the event ends
    //  draggable: true, //Allow an event to be dragged and dropped
      //resizable: true, //Allow an event to be resizable
      allDay: false, // set to true to display the event as an all day event on the day view
        color: calendarConfig.colorTypes.error,
         type: 'warning',
    //  actions: actions,
    }
    ];
    var actions = [{
        label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
        onClick: function(args) {
          alert.show('Edited', args.calendarEvent);
        }
      },
      {
        label: '<i class=\'glyphicon glyphicon-remove\'></i>',
        onClick: function(args) {
          alert.show('Deleted', args.calendarEvent);
        }
      }
    ];
    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
    this.isActif = Auth.isActif;
    this.$uibModal = $uibModal;
    this.OauthActif = true;
    this.DeviseSite = appConfig.DeviseSite || "Eco-système Libre";
    this.TitreSite = appConfig.TitreSite || "Libre Communaute";


    /* $scope.$on('$destroy', function () {
       socket.unsyncUpdates('thing');
     });*/
  }

  groupEvents = function(cell) {
       cell.groups = {};
       cell.events.forEach(function(event) {
         cell.groups[event.type] = cell.groups[event.type] || [];
         cell.groups[event.type].push(event);
       });
     };


  eventClicked = function(event) {
  //  alert('Clicked', event);
  };

  openNote(grp) {
    this.$uibModal.open({
      templateUrl: 'modalNote.html',
      controller: NoteComponent,
      controllerAs: "NC",
      resolve: {
        grp: function() {
          return grp;
        }
      }
    });
  }

  openPad(grp) {
    console.log(this.getCurrentUser());
    var auhorID = this.getCurrentUser().authorPadID;
    this.$http.post('/api/pads', {
      authorID: auhorID,
      groupID: grp.groupPadID
    }).success((data) => {
      if (data) {
        console.log(data)
        this.$cookies.put('sessionID', data.sessionID);
        this.$window.open('//localhost:9001/p/' + grp.groupPadID + "$" + grp.name + "?userName=" + this.getCurrentUser().name);
      } else alert("Pad  non trouvé ou vous n'êtes pas autorisé");
    }).error(function(err) {
      console.log("err :" + err)
      alert("Serveur Pad  non actif");
    });
  };
}

export default angular.module('eGroup.main', [uiRouter, require('angular-bootstrap-calendar')])

  //.constant('moment', require('moment-timezone'))
  .config(routing)
  .config(['calendarConfig', function(calendarConfig) {

    //calendarConfig.dateFormatter = 'moment'; // use moment to format dates
    console.log(calendarConfig);
  }])
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
