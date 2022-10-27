import express from 'express';
import users from './users.routes';
import auth from './auth.routes';
import categoryTopics from './categoryTopics.routes';
import courses from './courses.routes';
import sections from './section.routes';

const router = express.Router();

router.use('/', users);
router.use('/', auth);
router.use('/category-topics', categoryTopics);
router.use('/courses', courses);
router.use('/sections', sections);

export default router;
