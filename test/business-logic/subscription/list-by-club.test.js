import SubscriptionModel from "../../../src/models/subscription/subscription.model";
import ClubLogic from "../../../src/business-logic/club";
import listByClub from "../../../src/business-logic/subscription/list-by-club";

jest.mock('../../../src/business-logic/club');
jest.mock('../../../src/models/subscription/subscription.model');

describe('Business logic: Subscription: List by club', () => {
    afterEach(async () => {
        jest.resetAllMocks();
      });
    
    const subscriptions = [
        {
            name: 'name 1',
            price: 10000,
            description: 'description 1',
            clubId: 'clubId 1'
        },
        {
            name: 'name 2',
            price: 20000,
            description: 'description 2',
            clubId: 'clubId 1'
        },
        {
            name: 'name 3',
            price: 10000,
            description: 'description 3',
            clubId: 'clubId 1'
        }
    ];  

    it('Should return a list of subscriptions by club ', async() => {
        SubscriptionModel.find.mockReturnValue(subscriptions);

        ClubLogic.checkIfUserIsAdmin.mockReturnValue();

        const result = await listByClub({clubId: 'clubId 1', userId: 'userId 1'});

        expect(result).toEqual(subscriptions);
        expect(result).toHaveLength(3);

        result.forEach((subscription, i)=>{
            expect(subscription.name).toEqual(`name ${i + 1}`);
            expect(subscription).toHaveProperty('price');
            expect(subscription).toHaveProperty('description');
            expect(subscription).toHaveProperty('clubId');
        });
    });
});