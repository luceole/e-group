'use strict';

export function UserResource($resource) {
  'ngInject';

  return $resource('/api/users/:id/:controller', {
    id: '@_id'
  }, {
    changePassword: {
      method: 'PUT',
      params: {
        controller: 'password'
      }
    },
    get: {
      method: 'GET',
      params: {
        id: 'me'
      }
    },
    addusergroup: {
      method: 'PUT',
      params: {
        controller: 'addusergroup'
      }
    },
    delusergroup: {
      method: 'PUT',
      params: {
        controller: 'delusergroup'
      }
    }
  });
}
