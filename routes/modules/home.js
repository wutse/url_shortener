'use strict';

const express = require('express');
const router = express.Router();

const UrlShortener = require('../../models/urlShortener');

router.get('/', (req, res) => {
  console.log('get => /');
  res.redirect('/urlShorteners/new');
});

router.get('/:shortDst', (req, res) => {
  console.log(`get => /${req.params.shortDst}`);
  console.log(req.params);

  return UrlShortener.findOne({ shortDst: req.params.shortDst })
    .lean()
    .then(result => {
      console.log(result);
      if (result && result.src) {
        res.redirect(result.src);
      }
      else {
        res.redirect(`/urlShorteners/new?msg=src not found`);
      }
    })
    .catch(err => {
      console.log('query src failed.');
      console.log(err);
    });
});

module.exports = router;