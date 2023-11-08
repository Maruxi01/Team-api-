import { expect, jest } from '@jest/globals';
import ClubModel from '../../../src/models/club/club.model';
import getClub from '../../../src/business-logic/club/get';
import mongoose from 'mongoose';
import HTTPError from '../../../src/errors/http.error';

jest.mock('../../../src/models/club/club.model');

const generateObjectId = () => new mongoose.Types.ObjectId();

const createMockClub = () => ({
    _id: generateObjectId(),
    name: 'Test-Club',
    description: 'Test-Description'
});



describe('Business logic: Club: Get', () => {

    beforeEach(async () => {
        jest.resetAllMocks();
    });

    it('Should get the club by id', async () => {
        const expectedClub = createMockClub();
        const clubId = expectedClub._id;
        ClubModel.findById.mockResolvedValue(expectedClub);

        const actualClub = await getClub(clubId);
        expect(actualClub).not.toBeNull();
        expect(ClubModel.findById).toHaveBeenCalledWith(clubId);
        expect(actualClub).toEqual(expectedClub);
    });

    it('Should throw an error when the club does not exist', async () => {
        const nonExistentClubId = generateObjectId();
        ClubModel.findById.mockResolvedValue(null);
        
        try {
            await getClub(nonExistentClubId)
        } catch (error) {
            expect(error).toBeInstanceOf(HTTPError);
            expect(error.status).toBe(404);
            expect(ClubModel.findById).toHaveBeenCalled();
        }
    });
});