import { returnErrorResponse } from '../../../src/errors/error-response';
import MemberLogic from '../../../src/business-logic/member';
import listMembersController from '../../../src/controllers/club/list-members.controller';
import mongoose from 'mongoose';
import HTTPError from '../../../src/errors/http.error';

jest.mock('../../../src/errors/error-response');
jest.mock('../../../src/business-logic/member');

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

function generateMockMembers() {
    return [
        { id: generateObjectId(), name: 'Member1' },
        { id: generateObjectId(), name: 'Member2' },
        { id: generateObjectId(), name: 'Member3' },
    ];
}

describe('Controller: Club: List members', () => {
    let req, res;

    beforeEach(() => {
        req = createRequestObject();
        res = createResponseObject();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });


    it('Should return a list of members when the operation is successful', async () => {
        const mockListMembers = generateMockMembers();
        MemberLogic.listByClub.mockResolvedValue(mockListMembers);
        await listMembersController(req, res);
        expect(res.send).toHaveBeenCalledWith({ members: mockListMembers });
        expect(MemberLogic.listByClub).toHaveBeenCalledWith({ clubId: req.params.clubId, userId: req.userId });
        expect(returnErrorResponse).not.toHaveBeenCalled();
    });

    it('Should return an empty list when no members are found', async () => {
        MemberLogic.listByClub.mockResolvedValue([]);
        await listMembersController(req, res);
        expect(res.send).toHaveBeenCalledWith({ members: [] });
        expect(MemberLogic.listByClub).toHaveBeenCalledWith({ clubId: req.params.clubId, userId: req.userId });
        expect(returnErrorResponse).not.toHaveBeenCalled();
    });

    it('Should return an error when member logic fails', async () => {
        const error = new HTTPError({ name: 'error', message: 'some-error', code: 400 });
        MemberLogic.listByClub.mockRejectedValue(error);
        await listMembersController(req, res);
        expect(returnErrorResponse).toHaveBeenCalledWith({ error, res });
        expect(MemberLogic.listByClub).toHaveBeenCalled();
    });
});