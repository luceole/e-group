/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/groups              ->  index
 * POST    /api/groups              ->  create
 * GET     /api/groups/:id          ->  show
 * PUT     /api/groups/:id          ->  upsert
 * PATCH   /api/groups/:id          ->  patch
 * DELETE  /api/groups/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Group from './group.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;

  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function (entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch (err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Groups
export function index(req, res) {
  return Group.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Group from the DB
export function show(req, res) {
  return Group.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
export function showNote(req, res) {
  return Group.findOne({
      'name': 'dream'
    }, "-_id note").exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Group in the DB
export function create(req, res) {
  return Group.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Group in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  console.log("Upsert Groupe");
  console.log(req.body);
  return Group.findOneAndUpdate({
      _id: req.params.id
    }, req.body, {
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true
    }).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Group in the DB
export function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Group.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Group from the DB
export function destroy(req, res) {
  return Group.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

// Get list of open groupes
export function isopen(req, res) {
  console.log("IsOpen")
  Group.find({
      type: {
        $lt: 10
      }
    })
    .populate('owner', 'uid')
    .populate('participants', 'uid')
    .exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
};

export function events(req, res) {
  //var events = [{title:'Prem'},{title:'deuxieme', start:'2015-02-25'}];
  var events = [];
  Group.find({}).lean().exec(function (err, groupes) {
    groupes.forEach(function (groupe, index, tab) {
      events.push.apply(events, groupe.events);
      // console.log(index + " " + events);
    });
    return res.json(events);
  });
}

export function eventsofgroup(req, res) {
  var groupe = req.params.id;
  console.log(groupe);
  var events = [];
  Group.findById(req.params.id).lean()
    .populate('events.participants', 'uid')
    .exec(function (err, groupe) {
      if (err) {
        return handleError(res, err);
      }
      if (!groupe) {
        return res.send(404);
      }
      //events.push.apply(events, groupe.events);
      return res.json(groupe.events);
    });
}

export function eventupdate(req, res) {
  /* if (req.body._id) {
       delete req.body._id;
   }*/
  if ((req.user.role !== "admin") && (req.user.adminOf.indexOf(req.params.id) === -1)) {
    return res.send(403);
  }
  Group.findById(req.params.id, function (err, groupe) {
    if (err) {
      return handleError(res, err);
    }
    if (!groupe) {
      return res.send(404);
    }
    var ev = groupe.events.id(req.body._id);
    if (ev) { 
      // Event Exist
      // Modify
      console.log("Modify");
      ev.start = req.body.start;
      ev.allDay = req.body.allDay;
      if (req.body.end) {
        ev.end = req.body.end;
      }
      group.save(function (err, groupe) {
        if (err) {
          console.log(err);
          return handleError(res, err);
        }
        console.log("Groupe EventUpdate " + groupe.name);
        console.log(req.body);
        return res.json(groupe.events);
      });
    } else {
       // New ONE
      // PAD
      var args = {
        groupID: groupe.groupPadID,
        padName: req.body.start + "-" + req.body.end,
        text: 'Bienvenu sur le PAD  ' + req.body.title + ' - ' + req.body.start
      }
      etherpad.createGroupPad(args, function (error, data) {
        if (error) console.error('Error creating pad: ' + error.message)
        else {

          console.log('New pad created: ' + data.padID)
          req.body.eventPadID = data.padID;
        }
        groupe.events.push(req.body);
        groupe.save(function (err, groupe) {
          if (err) {
            console.log(err);
            return handleError(res, err);
          }
          console.log("Groupe EventCreate " + groupe.name);
          console.log(req.body);
          return res.json(groupe.events);
        });
      });
    }
  });
};

export function eventdelete(req, res) {
  console.log("eventdelete");
  //console.log(req.user);
  if (req.body._id) {
    delete req.body._id;
  }
  if ((req.user.role !== "admin") && (req.user.adminOf.indexOf(req.params.id) === -1)) {
    return res.send(403);
  }
  Group.findById(req.params.id, function (err, groupe) {
    if (err) {
      return handleError(res, err);
    }
    if (!groupe) {
      return res.send(404);
    }
    var ev = groupe.events.id(req.body.id);
    if (!ev) {
      return res.send(404);
    }
    ev.remove(function (err) {
      groupe.save(function (err, groupe) {
        if (err) {
          return handleError(res, err);
        }
        console.log("Groupe Update " + groupe.name);
        return res.json(groupe.events);
      });
    });
  });
};
