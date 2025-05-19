import express, { Router } from 'express';
import { TenantController } from '../controllers/TenantController';
import { TenantService } from '../services/TenantService';
import { AppDataSource } from '../config/data-source';
import { Tenant } from '../entity/Tenant';
import logger from '../config/logger';
import authenticate from '../middleswares/authenticate';
import { canAccess } from '../middleswares/canAccess';
import { Roles } from '../constants';

const router = express.Router();

const tenantRepository = AppDataSource.getRepository(Tenant);

const tenantService = new TenantService(tenantRepository);

const tenantController = new TenantController(tenantService, logger);

router.post('/', authenticate, canAccess([Roles.ADMIN]), (req, res, next) => {
    return tenantController.create(req, res, next);
});

export default router;
