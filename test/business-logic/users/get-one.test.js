import UserModel from '../../../src/models/user/user.model';
import {buildUser} from '../../factories/user.factory';
import getOne from '../../../src/business-logic/users/get-one';
import mongoose from 'mongoose';

jest.mock('../../../src/models/user/user.model');


describe('Business logic: Users: Get one', () => {
    
    it('should return a user', async() => {
        const user = buildUser({isAdmin: false});
        const query = new mongoose.Query();
        query.populate = jest.fn().mockReturnThis();
        query.select = jest.fn().mockReturnThis();
        query.exec = jest.fn().mockResolvedValue(user);

        UserModel.findOne = jest.fn().mockReturnValue(query);

        const result = await getOne({
            query: {email: user.email},
            select: ['name', 'email'],
            populate: ['club']
        });

        expect(result).toEqual(user);     
    });

});