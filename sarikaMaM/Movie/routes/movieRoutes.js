const express = require('express');
const router = express.Router();
const movieController = require('../controller/movieController');

router.post('/', movieController.createMovie);
router.get('/', movieController.getAllMovies);
router.get('/search', movieController.searchMovies);
router.get('/:id', movieController.getMovieById);
router.put('/:id', movieController.updateMovie);
router.post('/update/:id', movieController.updateMovie);
router.delete('/:id', movieController.deleteMovie);
router.get('/delete/:id', movieController.deleteMovie);

module.exports = router;
