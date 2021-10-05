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
  console.log(req.query);
  res.render('index', { msg: req.query.msg });
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

router.get('/:id/edit', (req, res) => {
  console.log(`get => /urlShorteners/${req.params.id}/edit`);

  return UrlShortener.findById(req.params.id)
    .lean()
    .then(result => {
      console.log('find edit data');
      console.log(result);
      return res.render('edit', { url: result });
    })
    .catch(err => {
      console.log('query result failed.');
      console.log(err);
    });
});

//create data
router.post('/', async (req, res) => {
  console.log('post => /urlShorteners');
  console.log(req.body);

  let isOld = await UrlShortener.findOne({ src: req.body.src })
    .then(result => {
      console.log('check same data.')
      if (result) {
        console.log('same data, redirect.')
        res.redirect(`/urlShorteners/result/${result.id}`);
        return true;
      }
      else {
        console.log('new data.')
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

//edit data
router.put('/:id', (req, res) => {
  console.log(`get => /urlShorteners/${req.params.id}/edit`);
  console.log(req.params);
  console.log(req.body);

  return UrlShortener.findById(req.params.id)
    .then(result => {
      result.src = req.body.src;

      console.log(result);

      return result.save()
        .then(() => res.redirect('/urlShorteners/list'))
        .catch(err => {
          console.log('save change data failed.');
          console.log(err);
        });
    })
    .catch(err => {
      console.log('query result failed.');
      console.log(err);
    });
});

//delete data
router.delete('/:id', (req, res) => {
  console.log(`delete => /urlShorteners/${req.params.id}`);
  return UrlShortener.findById(req.params.id)
    .then(data => data.remove())
    .then(() => res.redirect('/urlShorteners/list'))
    .catch(err => {
      console.log('delete data failed.');
      console.log(err);
    });
});

module.exports = router;