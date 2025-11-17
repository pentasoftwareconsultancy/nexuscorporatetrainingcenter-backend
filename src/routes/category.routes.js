import express from 'express';
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from '../controllers/category.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorizRole } from '../middlewares/roleMiddleware.js';
const router = express.Router();

router.get('/', getAllCategories); //done
router.get('/:category_id', getCategoryById);//done

// add admin protection
router.use(protect, authorizRole("admin"));
router.post('/', createCategory);//done
router.put('/:category_id', updateCategory); //done
router.delete('/:category_id', deleteCategory);

export default router;