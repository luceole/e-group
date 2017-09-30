'use strict';

import angular from 'angular';

export default angular.module('eCommunautApp.constants', [])
  .constant('appConfig', require('../../server/config/environment/shared'))
  .name;
