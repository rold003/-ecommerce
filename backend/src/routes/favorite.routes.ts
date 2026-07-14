import { Router } from 'express';
import * as favoriteController from '../controllers/favorite.controller';
import { authenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { favoriteParamsSchema } from '../validators/favorite.validator';

const router = Router();

router.use(authenticate);

router.get('/', favoriteController.listFavorites);
router.post('/:productId', validate(favoriteParamsSchema), favoriteController.addFavorite);
router.delete('/:productId', validate(favoriteParamsSchema), favoriteController.removeFavorite);

export default router;
