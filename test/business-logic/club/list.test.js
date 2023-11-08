import { expect, jest } from '@jest/globals';
import ClubModel from '../../../src/models/club/club.model';
import listClubs from '../../../src/business-logic/club/list';
import mongoose from 'mongoose';

jest.mock('../../../src/models/club/club.model.js');

describe('Business logic: Club: List', () => {
    beforeEach(async () => {
        jest.clearAllMocks();
    });

    it('Should return a list of clubs when clubs exist', async () => {
        const mockClubs = createMockClubs();
        mockClubModelFindWithQuery(mockClubs);

        const response = await listClubs();

        validateResponseAndFindCall(response, mockClubs);
    });

    it('Should return an empty list when no clubs exist', async () => {
        const mockClubs = [];
        mockClubModelFindWithQuery(mockClubs);

        const response = await listClubs();

        validateResponseAndFindCall(response, mockClubs);
    });
});

function createMockClubs() {
    return [
        { name: 'club1', admin: 'admin1' },
        { name: 'club2', admin: 'admin2' },
        { name: 'club3', admin: 'admin3' }
    ];
}

function mockClubModelFindWithQuery(mockClubs) {
    const query = new mongoose.Query();
    query.populate = jest.fn().mockImplementation((path) => {
        expect(path).toBe('admin managers.userId');
        return query;
    });
    query.exec = jest.fn().mockResolvedValue(mockClubs);
    ClubModel.find = jest.fn().mockReturnValue(query);
}

function validateResponseAndFindCall(response, expectedClubs) {
    expect(response).toEqual(expectedClubs);
    expect(ClubModel.find).toHaveBeenCalled();
}