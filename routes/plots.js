'use strict';

const express = require('express');
const router = express.Router();
const knex = require('../knex');

// Gets all the plots.
router.get('/', (req, res, next) => {
  knex('plots')
    .then(results => {
      if (results.length === 0) {
        return next()
      }
      res.status(200).send(results)
    })
    .catch(error => {
      return next(error)
    })
});

// Gets a specific plot by Plot ID.
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  knex('plots')
    .where('plots.id', id)
    .first()
    .then(result => {
      if (result) {
        return res.status(200).send(result)
      }
      return next()
    })
    .catch(error => {
      return next(error)
    })
});

// Create new plot
router.post('/', (req, res, next) => {
  knex('plots')
    .insert({ user_id: req.body.user_id, farm: req.body.farm, image_url: req.body.image_url, about: req.body.about })
    .returning('*')
    .then(result => {
      res.status(200).send(result)
    })
    .catch(error => {
      return next(error)
    })
});

// Update specific plot
router.patch('/:id', (req, res, next) => {
  const id = req.params.id;
  knex('plots')
    .update({ user_id: req.body.user_id, farm: req.body.farm, image_url: req.body.image_url, about: req.body.about })
    .where('plots.id', id)
    .returning('*')
    .then(good => {
      return knex('plots')
        .where('plots.id', id)
        .first()
        .then(result => {
          res.status(200).send(result);
        })
        .catch(err => {
          next(err);
        })
    })
    .catch(error => {
      return next(error)
    })
})

// Delete plot by id
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  knex('plots')
    .where('plots.id', id)
    .del()
    .then(result => {
      return res.send(200)
    })
    .catch(error => {
      return next(error)
    })
})

module.exports = router;