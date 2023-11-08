import { returnErrorResponse } from '../../../src/errors/error-response';
import ClubLogic from '../../../src/business-logic/club'
import list from "../../../src/controllers/club/list.controller";
import mongoose from 'mongoose';


jest.mock('../../../src/errors/error-response');
jest.mock('../../../src/business-logic/club');

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

function generateMockClub(num) {
    return {
        name: `Club${num}`,
        description: `This is a mock club${num}`,
        managers: [{
            userId: generateObjectId(),
            role: 'Manager'
        }],
        admin: generateObjectId(),
    };
}

function generateMockClubs(count = 3) {
    return Array.from({ length: count }, (_, i) => generateMockClub(i + 1));
}

describe('Controller: Club: List', () => {
    let req, res;

    beforeEach(() => {
        req = createRequestObject();
        res = createResponseObject();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('Should return a list of clubs when the operation is successful', async () => {
        const mockListClubs = generateMockClubs();
        ClubLogic.list.mockResolvedValue(mockListClubs);
        await list(req, res);
        expect(res.send).toHaveBeenCalledWith({ clubs: mockListClubs });
    });

    it('Should return a empty list of clubs', async () => {
        ClubLogic.list.mockReturnValue([]);

        await list({}, res);

        expect(res.send).toBeCalledWith({ clubs: [] });
        expect(ClubLogic.list).toHaveBeenCalled();
    });

    it('Should return an error when club logic fails', async () => {
        const mockError = new Error('Club error: Failed to list clubs');
        ClubLogic.list.mockRejectedValue(mockError);
        await list(req, res);
        expect(returnErrorResponse).toHaveBeenCalledWith({ error: mockError, res });
        expect(ClubLogic.list).toHaveBeenCalled();
    });
})