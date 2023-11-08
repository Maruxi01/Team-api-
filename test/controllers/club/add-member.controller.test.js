import MemberLogic from '../../../src/business-logic/member';
import { returnErrorResponse } from '../../../src/errors/error-response';
import { addValidation } from '../../../src/validations/member.validations';
import addMemberController from '../../../src/controllers/club/add-member.controller';
import HTTPError from '../../../src/errors/http.error';
import mongoose from 'mongoose';

jest.mock('../../../src/errors/error-response');
jest.mock('../../../src/business-logic/member');
jest.mock('../../../src/validations/member.validations');

const generateObjectId = () => new mongoose.Types.ObjectId();

const createRequestObject = () => ({
    body: { name: 'TestUser' },
    params: { clubId: generateObjectId() },
    userId: generateObjectId(),
});

const createResponseObject = () => ({
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
});

describe('Controller: Club: Add new member', () => {
    let req, res;

    beforeEach(() => {
        req = createRequestObject();
        res = createResponseObject();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });


    it('Should return a member when creation is successful', async () => {
        const mockMember = { id: generateObjectId(), name: 'TestUser' };
        MemberLogic.create.mockResolvedValue(mockMember);
        await addMemberController(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalledWith({ member: mockMember });
    });

    it('Should return an error when member validation fails', async () => {
        const mockValidationError = new Error('Validation error: Failed to add member');
        addValidation.validateAsync.mockRejectedValue(mockValidationError);
        await addMemberController(req, res);
        expect(returnErrorResponse).toHaveBeenCalledWith({ error: mockValidationError, res });
    });

    it('Should return an error when member creation fails', async () => {
        const mockError = new HTTPError({ name: 'error', message: 'some-error', code: 400 });
        MemberLogic.create.mockRejectedValue(mockError);
        await addMemberController(req, res);
        expect(returnErrorResponse).toHaveBeenCalledWith({ error: mockError, res });
    });

});