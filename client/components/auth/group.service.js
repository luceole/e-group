'use strict';

export function GroupResource($resource) {
  'ngInject';

  return $resource('/api/groups/:id/:controller', {
    id: '@_id'
  }, {

    listopengroups: {
      method: 'GET',
      isArray: true,
      params: {
        controller: 'isopen'
      }
    },
    get: {
      method: 'GET',
    },

    update: {
      method: 'PUT',
    }
  });
};
