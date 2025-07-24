const Question = require('../model/Question');
const Category = require('../model/Category');
const Answer = require('../model/Answer');
const User = require('../model/users');
 
class QuestionController {
  
  // Create a new category
  async createCategory(req, res) {
    try {
      const { name } = req.body;
      const existing = await Category.findOne({ name });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Category already exists.',
        });
      }
      const category = await Category.create({ name });
      res.status(201).json({
        success: true,
        message: 'Category created successfully.',
        data: category,
      });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: 'Failed to create category.',
        error: err.message,
      });
    }
  }
  
  // fetcheh all category
  async fetchedCategory(req, res) {
    try {
       const category = await Category.aggregate([{
        $project:{
          createdAt:0,
          updatedAt:0
        }
       }]);
      res.status(200).json({
        success: true,
        count:category.length,
        message: 'Category fetched successfully.',
        data: category,
      });
    } catch (err) {
       res.status(400).json({
        success: false,
        message: 'Failed to fetched category.',
        error: err.message,
      });
    }
  }
     
  // Create a new question
 async createQuestion(req, res) {
  try {
    const { text, options, categoryIds, defaultAnswer } = req.body;

    if (!options.includes(defaultAnswer)) {
      return res.status(400).json({
        success: false,
        message: 'Default answer must be one of the options.'
      });
    }

    const question = await Question.create({
      text,
      options,
      categories: categoryIds,
      defaultAnswer
    });

    res.status(201).json({
      success: true,
      message: 'Question created successfully.',
      data: question
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Failed to create question.',
      error: err.message
    });
  }
}

  // fetcheh all question
  async fetchedQuestions(req, res) {
    try {
       const question = await Question.aggregate([{
        $project:{
          createdAt:0,
          updatedAt:0
        }
       }]);
      res.status(200).json({
        success: true,
        count:question.length,
        message: 'Question fetched successfully.',
        data: question,
      });
    } catch (err) {
       res.status(400).json({
        success: false,
        message: 'Failed to fetched question.',
        error: err.message,
      });
    }
  }

 async submitAnswer(req, res) {
  try {
    const { userId, questionId, selectedOption } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found.',
      });
    }

    if (!question.options.includes(selectedOption)) {
      return res.status(400).json({
        success: false,
        message: 'Selected option is not valid for this question.',
      });
    }

    const isCorrect = question.defaultAnswer === selectedOption;

    const answer = await Answer.create({
      user: userId,
      question: questionId,
      selectedOption,
      isCorrect
    });

     const resultMessage = isCorrect ? 'Correct answer!' : `Incorrect answer. The correct answer is "${question.defaultAnswer}".`;

    res.status(201).json({
      success: true,
      message: 'Answer submitted successfully.',
      data: {
        answer,
        correct: isCorrect,
        resultMessage
      },
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit answer.',
      error: err.message,
    });
  }
}


   async searchQuestionWithAnswer(req, res) {
    try {
      const { searchText, userId } = req.query;

      const questions = await Question.aggregate([
        { $match: { text: { $regex: searchText, $options: 'i' } } },
        {
          $lookup: {
            from: 'answers',
            let: { qid: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$question', '$$qid'] },
                      { $eq: ['$user', { $toObjectId: userId }] },
                    ],
                  },
                },
              },
              {
                $project: {
                  selectedOption: 1,
                  submittedAt: 1,
                },
              },
            ],
            as: 'userAnswer',
          },
        },
        {
          $unwind: {
            path: '$userAnswer',
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);

      res.status(200).json({
        success: true,
        message: 'Questions retrieved successfully.',
        data: questions,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to search questions.',
        error: err.message,
      });
    }
  }

  // Get all categories with the count of questions in each
  async getCategoriesWithQuestionCount(req, res) {
    try {
      const data = await Category.aggregate([
        {
          $lookup: {
            from: 'questions',
            localField: '_id',
            foreignField: 'categories',
            as: 'questions',
          },
        },
        {
          $project: {
            name: 1,
            questionCount: { $size: '$questions' },
          },
        },
      ]);

      res.status(200).json({
        success: true,
        message: 'Categories with question counts retrieved successfully.',
        data,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve categories.',
        error: err.message,
      });
    }
  }
}

module.exports = new QuestionController();
