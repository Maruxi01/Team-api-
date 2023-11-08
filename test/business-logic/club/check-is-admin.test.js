import { jest } from '@jest/globals';
import ClubModel from '../../../src/models/club/club.model';
import checkIfTheUserIsTheClubAdmin from '../../../src/business-logic/club/check-is-admin';
import HTTPError from '../../../src/errors/http.error';
import clubErrors from '../../../src/errors/club.errors';
import mongoose from 'mongoose';

jest.mock('../../../src/models/club/club.model');

describe('Business logic: Club: Check is admin', () => {
    const club = {
        name: 'club-test',
        description: 'description',
    };

    const generateObjectId = () => new mongoose.Types.ObjectId();

    beforeAll(() => {
        jest.clearAllMocks();
    });

    it('Should verify if the provided user is the club administrator', async () => {
        const userId = generateObjectId();
        const clubId = generateObjectId();
        ClubModel.findOne.mockResolvedValue({ ...club, _id: clubId, admin: userId });
        await expect(checkIfTheUserIsTheClubAdmin({ clubId, userId })).resolves.not.toThrow();

        expect(ClubModel.findOne).toHaveBeenCalledWith({ _id: clubId, admin: userId });
    });

    it('Should throw an error if the provided user is not the club administrator', async () => {
        const userId = generateObjectId();
        const clubId = generateObjectId();
        ClubModel.findOne.mockResolvedValue(null);
        
        try {
            await checkIfTheUserIsTheClubAdmin({ clubId, userId });
            throw new Error('unexpected error');
        } catch (error) {
            await expect(checkIfTheUserIsTheClubAdmin({ clubId, userId })).rejects.toThrow(HTTPError);
            expect(error.message).toEqual(clubErrors.userIsNotTheAdmin.message);
            expect(ClubModel.findOne).toHaveBeenCalled();
        }
    });
});