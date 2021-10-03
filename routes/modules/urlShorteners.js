'use strict';

const express = require('express');
const router = express.Router();

const UrlShortener = require('../../models/urlShortener');

router.get('/', (req, res) => {
  console.log('get => /urlShorteners');
  res.render('list');
});


router.get('/new', (req, res) => {
  console.log('get => /urlShorteners/new');
  res.render('index');
});

router.get('/list', (req, res) => {
  console.log('get => /urlShorteners/list');
  return UrlShortener.find()
    .lean()
    .then(urls => res.render('list', { urlShorteners: urls }))
    .catch(err => {
      console.log('query all failed.');
      console.log(err);
    });
});

router.get('/result/:id', (req, res) => {
  console.log(`get => /urlShorteners/result/${req.params.id}`);

  return UrlShortener.findById(req.params.id)
    .lean()
    .then(result => res.render('result', { result }))
    .catch(err => {
      console.log('query result failed.');
      console.log(err);
    });
});

router.post('/', async (req, res) => {
  console.log('post => /urlShorteners');
  console.log(req.body);

  let isOld = await UrlShortener.findOne({ src: req.body.src })
    .then(result => {
      console.log('create same data.')
      if (result) {
        console.log('redirect.')
        res.redirect(`/urlShorteners/result/${result.id}`);
        return true;
      }
      else {
        return false
      }
    })
    .catch(err => {
      console.log(`query ${req.body.src} failed.`);
      console.log(err);
    });

  if (isOld) {
    return;
  }

  let nextIndex = 100000000;
  await UrlShortener.aggregate([{ $group: { _id: null, maxIndex: { $max: "$index" } } }])
    .then(results => {
      if (results && results.length > 0) {
        nextIndex = results[0].maxIndex;
      }
    });

  nextIndex += 1;
  const newData = new UrlShortener();
  newData.index = nextIndex;
  newData.src = req.body.src;
  newData.shortDst = UrlShortener.shorten(nextIndex);

  return newData.save()
    .then((result) => {
      res.redirect(`/urlShorteners/result/${result.id}`)
    })
    .catch(err => {
      console.log('create data failed.');
      console.log(err);
    });

});

module.exports = router;