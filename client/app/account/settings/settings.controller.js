'use strict';

export default class SettingsController {

  /*@ngInject*/
  constructor(Auth, Group) {
    this.Auth = Auth;
    this.Group = Group;
    this.getCurrentUser = Auth.getCurrentUser;
    this.user = Auth.getCurrentUserSync();
    //  this.errors = {};
    this.editMessage = '';
    this.groups = Group.listopengroups(); // Groupe OPEN

  }

  isMemberOf(groupe) {
    var grpId = groupe._id
    //console.log(this.user)
    return this.user.memberOf.find(o => o._id === grpId)
  };
  addusergroup(groupe) {
    var grpId = groupe._id
    //  var groupeInfo = groupe.info;
    this.Auth.addUserGroup(grpId, (err, u) => {
      if (err) {
        alert("Erreur MAJ " + err);
        console.log(err)
      }
      this.user = this.Auth.getCurrentUserSync();
      this.groups = this.Group.listopengroups()
    });

  };

  delusergroup(groupe) {
    var grpId = groupe._id
    var groupeInfo = groupe.info
    this.Auth.delUserGroup(grpId, (err, u) => {
      if (err) {
        alert("Erreur MAJ " + err.data);
        console.log(err)
      }
      //      console.log(u)
      //      this.user=u;  // Pas utilisable ??  problème mongoose pull avec populate
      /*      console.log(this.user.memberOf);
            angular.forEach(this.user.memberOf, (o, i) => {
              console.log(o + "=?"+grpId)
              if (o== grpId) {
                  console.log(this.user.memberOf)
                this.user.memberOf.splice(i, 1);
                console.log(this.user.memberOf)
              }
            });
            */

      this.user = this.Auth.getCurrentUserSync();
      this.groups = this.Group.listopengroups();
    });

  };
}
