import { NextFunction, Response, Request } from 'express';
import { TenantService } from '../services/TenantService';
import { CreateTenantRequest } from '../types';
import { Logger } from 'winston';
import createHttpError from 'http-errors';
import { validationResult } from 'express-validator';

export class TenantController {
    constructor(
        private tenantService: TenantService,
        private logger: Logger,
    ) {}

    async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
        // Validation
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { name, address } = req.body;
        this.logger.debug('Request for creating tenant', { name, address });
        try {
            const tenant = await this.tenantService.create({ name, address });
            this.logger.info('Tenant has been created', { id: tenant.id });

            res.status(201).json({ id: tenant.id });
        } catch (err) {
            next(err);
        }
    }

    async update(req: CreateTenantRequest, res: Response, next: NextFunction) {
        // Validation
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { name, address } = req.body;
        const tenantId = req.params.id;

        if (isNaN(Number(tenantId))) {
            next(createHttpError(400, 'Invalid url param.'));
            return;
        }
        this.logger.debug('Request for updating a tenant', req.body);

        try {
            await this.tenantService.update(Number(tenantId), {
                name,
                address,
            });

            this.logger.info('Tenant has been updated', { id: tenantId });

            res.json({ id: Number(tenantId) });
        } catch (err) {
            next(err);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const tenants = await this.tenantService.getAll();

            this.logger.info('All tenant have been fetched');
            res.json(tenants);
        } catch (err) {
            next(err);
        }
    }
    async getOne(req: Request, res: Response, next: NextFunction) {
        const tenantId = req.params.id;

        if (isNaN(Number(tenantId))) {
            next(createHttpError(400, 'Invalid url param.'));
            return;
        }

        try {
            const tenants = await this.tenantService.getById(Number(tenantId));

            if (!tenants) {
                next(createHttpError(400, 'Tenant id does not exits.'));
                return;
            }

            this.logger.info('All tenant have been fetched');
            res.json(tenants);
        } catch (err) {
            next(err);
        }
    }

    async destroy(req: Request, res: Response, next: NextFunction) {
        const tenantId = req.params.id;

        if (isNaN(Number(tenantId))) {
            next(createHttpError(400, 'Invalid url param.'));
            return;
        }

        try {
            await this.tenantService.deleteById(Number(tenantId));

            this.logger.info('All tenant have been fetched');
            res.json({ id: Number(tenantId) });
        } catch (err) {
            next(err);
        }
    }
}
