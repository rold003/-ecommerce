import { Router } from 'express';
import * as addressController from '../controllers/address.controller';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import {
  addressParamsSchema,
  addressSchema,
  updateAddressSchema,
} from '../validators/address.validator';
import { changePasswordSchema, updateProfileSchema } from '../validators/user.validator';

const router = Router();

router.use(authenticate);

router.patch('/me', validate(updateProfileSchema), userController.updateProfile);
router.patch('/me/password', validate(changePasswordSchema), userController.changePassword);

router.get('/me/addresses', addressController.listAddresses);
router.post('/me/addresses', validate(addressSchema), addressController.createAddress);
router.patch('/me/addresses/:id', validate(updateAddressSchema), addressController.updateAddress);
router.delete(
  '/me/addresses/:id',
  validate(addressParamsSchema),
  addressController.deleteAddress,
);

export default router;
