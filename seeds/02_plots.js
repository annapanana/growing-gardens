'use strict';

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('plots').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('plots').insert({
          id: 1,
          user_id: 1,
          farm: 'Hawthorne Garden',
          image_url: 'https://d1k5w7mbrh6vq5.cloudfront.net/images/cache/60/e6/ce/60e6ceb32705f3141fb5013c6a039ea9.jpg',
          about: 'I raised all five of my kids on organic produce.',
          name: 'The Gooseberry Family'
        }),
        knex('plots').insert({
          id: 2,
          user_id: 2,
          farm: 'Alta Park',
          image_url: 'https://d1k5w7mbrh6vq5.cloudfront.net/images/cache/60/e6/ce/60e6ceb32705f3141fb5013c6a039ea9.jpg',
          about: 'I love me some crocs. They are great gardening shoes, and you can eat them in desperate situations.',
          name: 'Anna Lotko'
        }),
        knex('plots').insert({
          id: 3,
          user_id: 3,
          farm: "Roger's Grove Garden",
          image_url: 'https://d1k5w7mbrh6vq5.cloudfront.net/images/cache/60/e6/ce/60e6ceb32705f3141fb5013c6a039ea9.jpg',
          about: 'We are a family of potato eaters, and we are a bunch of spuds.',
          name: 'Mrs. Jays 3rd Grade Class'
        }),
        knex('plots').insert({
          id: 4,
          user_id: 4,
          farm: 'Fortune Garden',
          image_url: 'https://d1k5w7mbrh6vq5.cloudfront.net/images/cache/60/e6/ce/60e6ceb32705f3141fb5013c6a039ea9.jpg',
          about: 'I retired five years ago and now I spend all my time growing peppercorns and other deliteful things.',
          name: 'The Tomato Heads'
        }),
        knex('plots').insert({
          id: 5,
          user_id: 5,
          farm: 'Holiday Garden',
          image_url: 'https://d1k5w7mbrh6vq5.cloudfront.net/images/cache/60/e6/ce/60e6ceb32705f3141fb5013c6a039ea9.jpg',
          about: 'Sometimes I code, and sometimes I grow spicy things.',
          name: 'Matt Lindly'
        })
      ]);
    })
    .then(() => knex.raw("ALTER TABLE plots AUTO_INCREMENT = 1"));
};
