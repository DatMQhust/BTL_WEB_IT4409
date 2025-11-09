const catchAsync = require('../utils/catchAsync');
const authorService = require('../services/author.service');

const createAuthor = catchAsync(async (req, res) => {
  const newAuthor = await authorService.createAuthor(req.body);
  res.status(201).send(newAuthor);
});

const getAllAuthors = catchAsync(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const authors = await authorService.getAllAuthors({ page, limit });
  res.send(authors);
});

const getAuthorById = catchAsync(async (req, res) => {
  const author = await authorService.getAuthorById(req.params.id);
  if (author) {
    res.send(author);
  } else {
    res.status(404).send('Tác giả không tồn tại');
  }
});

const updateAuthor = catchAsync(async (req, res) => {
  const updatedAuthor = await authorService.updateAuthor(
    req.params.id,
    req.body
  );
  if (updatedAuthor) {
    res.send(updatedAuthor);
  } else {
    res.status(404).send('Tác giả không tồn tại');
  }
});

const deleteAuthor = catchAsync(async (req, res) => {
  const deletedAuthor = await authorService.deleteAuthor(req.params.id);
  if (deletedAuthor) {
    res.send(deletedAuthor);
  } else {
    res.status(404).send('Tác giả không tồn tại');
  }
});

module.exports = {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
};
