import { returnErrorResponse } from '../../../src/errors/error-response';
import SubscriptionLogic from '../../../src/business-logic/subscription';
import listSubscriptionsController from '../../../src/controllers/club/list-subscriptions.controller';
import mongoose from 'mongoose';
import HTTPError from '../../../src/errors/http.error';

jest.mock('../../../src/errors/error-response');
jest.mock('../../../src/business-logic/subscription');

const generateObjectId = () => new mongoose.Types.ObjectId();

function createRequestObject() {
    return {
        params: { clubId: generateObjectId() },
        userId: generateObjectId(),
    };
}

function createResponseObject() {
    return {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };
}

function generateMockSubscriptions() {
    return [
        { id: generateObjectId(), name: 'Suscription1' },
        { id: generateObjectId(), name: 'Suscription2' },
        { id: generateObjectId(), name: 'Suscription3' },
    ];
}

describe('Controller: Club: List subscriptions', () => {
    let req, res;

    beforeEach(() => {
        req = createRequestObject();
        res = createResponseObject();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('Should return a list of subscriptions when the operation is successful', async () => {
        const mockListSubscriptions = generateMockSubscriptions();
        SubscriptionLogic.listByClub.mockResolvedValue(mockListSubscriptions);
        await listSubscriptionsController(req, res);
        expect(res.send).toHaveBeenCalledWith({ subscriptions: mockListSubscriptions });
        expect(SubscriptionLogic.listByClub).toHaveBeenCalledWith({ clubId: req.params.clubId, userId: req.userId });
        expect(returnErrorResponse).not.toHaveBeenCalled();

    });

    it('Should return an empty list when no subscriptions are found', async () => {
        SubscriptionLogic.listByClub.mockResolvedValue([]);
        await listSubscriptionsController(req, res);
        expect(res.send).toHaveBeenCalledWith({ subscriptions: [] });
        expect(SubscriptionLogic.listByClub).toHaveBeenCalledWith({ clubId: req.params.clubId, userId: req.userId });
    });

    it('Should return a HTTP error when the logic fails', async () => {
        const error = new HTTPError({ name: 'error', message: 'some-error', code: 400 });
        SubscriptionLogic.listByClub.mockRejectedValue(error);
        await listSubscriptionsController(req, res);
        expect(returnErrorResponse).toHaveBeenCalledWith({ error, res });
        expect(SubscriptionLogic.listByClub).toHaveBeenCalled();
    });
});
