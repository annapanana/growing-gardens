'use strict';
module.exports = function (app, io) {

  const express = require('express');
  const knex = require('../knex');

  function confirmUsersPost(id) {
    return knex('digests')
      .where('digests.id', id)
      .first();
  }

  app.get('/api/digests', (req, res, next) => {
    knex('digests')
      .join('users', 'users.id', 'digests.user_id')
      .then(results => {
        if (results.length === 0) {
          return res.send(404);
        }
        let digestResults = [];
        for (let i = 0; i < results.length; i++) {
          let digestObj = {
            first_name: results[i].first_name,
            last_initial: results[i].last_name[0],
            message: results[i].message
          };
          digestResults.push(digestObj);
        }
        return res.status(200).send(digestResults);
      })
      .catch(err => {
        next(err);
      });
  });

  app.get('/api/digests/:id', (req, res, next) => {
    const id = req.params.id;

    knex('digests')
      .where('digests.id', id)
      .first()
      .then(result => {
        if (!result) {
          return res.send(404);
        }
        return res.status(200).send(result);
      })
      .catch(err => {
        next(err);
      });
  });

  app.post('/api/digests', (req, res, next) => {
    // Object deconstruction to grab same words from the request body.
    const { message } = req.body;
    // Creates the newPost object, leaving out what does not exist.
    const user_id = req.decoded.user_id;
    const newDigest = { user_id, message };
    knex('digests')
      .insert(newDigest)
      .then(result => {
        return knex('users')
          .where('users.id', user_id)
          .first()
          .then(result => {
            if (!result) {
              res.sendStatus(404);
            }
            let returnObj = {
              'first_name': result.first_name,
              'last_initial': result.last_name[0],
              'message': message
            }
            io.emit('new message', returnObj);
            return res.status(200).send(returnObj);
          })
          .catch(err => {
            next(err);
          });
      })
      .catch(err => {
        next(err);
      });
  });

  app.patch('/api/digests/:id', (req, res, next) => {
    // Creates the ID of the post that will be manipulated.
    const id = req.params.id;
    // Object deconstruction to grab same words from the request body.
    const { message } = req.body;
    // Creates the updated object, leaving out what does not exist.
    const updatedDigest = { message };

    confirmUsersPost(id).then(result => {
      if ((req.decoded.is_admin && result) || (result.user_id === req.decoded.user_id && result)) {
        knex('digests')
          .where('digests.id', id)
          .update(updatedDigest, '*')
          .then(success => {
            return knex('digest')
              .where('digest.id', id)
              .first()
              .then(result => {
                res.status(200).send(result);
              })
              .catch(err => {
                next(err);
              });
          })
          .catch(err => {
            next(err);
          });
      } else {
        return res.status(401).send({
          success: false,
          message: 'Unauthorized.'
        });
      }
    })
  });

  app.delete('/api/digests/:id', (req, res, next) => {
    // Creates the ID of the post that will be deleted.
    const id = req.params.id;
    // Deletes it.
    confirmUsersPost(id).then(result => {
      if ((req.decoded.is_admin && result) || (result.user_id === req.decoded.user_id && result)) {
        knex('digests')
          .where('digests.id', id)
          .del()
          .then(result => {
            res.send(200);
          })
          .catch(err => {
            next(err);
          });
      } else {
        return res.status(401).send({
          success: false,
          message: 'Unauthorized.'
        });
      }
    })
  });

}
