import ClubLogic from '../../src/business-logic/club';
import checkClubExists from '../../src/utils/check-club-exists.util';
import mongoose from 'mongoose';
import HTTPError from '../../src/errors/http.error';

jest.mock('../../src/business-logic/club');

describe('Utils: Check Club Exists', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const club = {
        name: 'club-test',
        description: 'description',
    };

    const generateObjectId = () => new mongoose.Types.ObjectId();


    it('Should check if a club exists', async() => {
        const clubId = generateObjectId();
        await ClubLogic.get.mockReturnValue({...club, _id: clubId });

        await expect(checkClubExists({ clubId, errorObject: new HTTPError(404, 'Club not found') }))
        .resolves.not.toThrow();
    });

    it('Should throw an error if the club doesnt exist', async() => {
        const clubId = generateObjectId();
        await ClubLogic.get.mockReturnValue(null);
        const mockError = new HTTPError({code: 404, message:'Club not found'});

        try {
            await expect(checkClubExists({ clubId, errorObject: mockError })) 
            .rejects.toThrow();
        } catch(error){
            expect(error).toBeInstanceOf(HTTPError); 
            expect(error.message).toEqual('Club not found');
            expect(error.statusCode).toEqual(404);
        }
    });
});