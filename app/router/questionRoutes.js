const express = require('express');
const router = express.Router();
const QuestionController = require('../controller/questionController');

router.post('/categories', QuestionController.createCategory);
router.get('/fetched-categories', QuestionController.fetchedCategory);

router.post('/questions', QuestionController.createQuestion);
router.get('/fetched-questions', QuestionController.fetchedQuestions);

router.post('/answers', QuestionController.submitAnswer);
router.get('/questions/search', QuestionController.searchQuestionWithAnswer);
router.get('/categories/count', QuestionController.getCategoriesWithQuestionCount);

module.exports = router;
