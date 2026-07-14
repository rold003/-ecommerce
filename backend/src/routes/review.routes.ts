import { Router } from 'express';
import * as reviewController from '../controllers/review.controller';
import { authenticate, authorize } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import {
  createReviewSchema,
  moderateReviewSchema,
  productReviewsQuerySchema,
  reviewParamsSchema,
  updateReviewSchema,
} from '../validators/review.validator';

// mergeParams: true para heredar :productId del path donde se monte este router
// (ver routes/index.ts -> /products/:productId/reviews).
export const productReviewRouter = Router({ mergeParams: true });

productReviewRouter.get('/', validate(productReviewsQuerySchema), reviewController.listProductReviews);
productReviewRouter.post('/', authenticate, validate(createReviewSchema), reviewController.createReview);

export const reviewRouter = Router();

reviewRouter.put('/:id', authenticate, validate(updateReviewSchema), reviewController.updateReview);
reviewRouter.delete('/:id', authenticate, validate(reviewParamsSchema), reviewController.deleteReview);
reviewRouter.patch(
  '/:id/moderate',
  authenticate,
  authorize('ADMIN'),
  validate(moderateReviewSchema),
  reviewController.moderateReview,
);
