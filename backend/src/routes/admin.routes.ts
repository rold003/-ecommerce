import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { listUsersSchema, salesReportQuerySchema, updateUserAdminSchema } from '../validators/admin.validator';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', adminController.getDashboard);
router.get('/reports/sales', validate(salesReportQuerySchema), adminController.getSalesReport);
router.get('/users', validate(listUsersSchema), adminController.listUsers);
router.patch('/users/:id', validate(updateUserAdminSchema), adminController.updateUser);

export default router;
