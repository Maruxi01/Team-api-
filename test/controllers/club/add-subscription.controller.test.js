import { returnErrorResponse } from '../../../src/errors/error-response';
import SubscriptionLogic from '../../../src/business-logic/subscription';
import { addValidation } from '../../../src/validations/subscription.validations';
import addSubscriptionController from '../../../src/controllers/club/add-subscription.controller';
import mongoose from 'mongoose';

jest.mock('../../../src/errors/error-response');
jest.mock('../../../src/business-logic/subscription');
jest.mock('../../../src/validations/subscription.validations');

const generateObjectId = () => new mongoose.Types.ObjectId();

const mockSubscription = {
    name: 'Suscription-Test',
    price: 100000,
    description: 'Suscription-Description-Test',
    clubId: generateObjectId(),
};

function createRequestObject() {
    return {
        body: {
            name: mockSubscription.name,
            price: mockSubscription.price,
            description: mockSubscription.description,
        },
        params: {
            clubId: mockSubscription.clubId,
        },
        userId: mockSubscription.userId,
    };
}

function createResponseObject() {
    return {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };
}

describe('Controller: Club: Add subscription', () => {
    let req, res;

    beforeEach(() => {
        req = createRequestObject();
        res = createResponseObject();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });


    it('Should return a subscription when creation is successful', async () => {
        addValidation.validateAsync.mockResolvedValue();
        SubscriptionLogic.create.mockResolvedValue(mockSubscription);

        await addSubscriptionController(req, res);
        expect(addValidation.validateAsync).toHaveBeenCalledWith(req.body);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(SubscriptionLogic.create).toHaveBeenCalledWith({
            ...req.body,
            clubId: req.params.clubId,
            userId: req.userId,
          });
        expect(res.send).toHaveBeenCalledWith({ subscription: mockSubscription });
    });

    it('Should return an error when subscription validation fails', async () => {
        const mockValidationError = new Error('Validation error: Failed to add subscription');
        addValidation.validateAsync.mockRejectedValue(mockValidationError);
        await addSubscriptionController(req, res);
        expect(returnErrorResponse).toHaveBeenCalledWith({ error: mockValidationError, res });
    });

    it('Should return an error when name is not defined', async () => {
        const reqWithoutName = {
            ...req,
            body: {
                ...req.body,
                name: undefined,
            },
        };
        const mockValidationError = new Error('Validation error: Name is required');
        addValidation.validateAsync.mockRejectedValue(mockValidationError);
        await addSubscriptionController(reqWithoutName, res);
        expect(returnErrorResponse).toHaveBeenCalledWith({ error: mockValidationError, res });
    });
});