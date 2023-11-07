import create from "../../../src/business-logic/subscription/create";
import ClubLogic from "../../../src/business-logic/club";
import checkClubExists from "../../../src/utils/check-club-exists.util";
import SubscriptionModel from "../../../src/models/subscription/subscription.model";

jest.mock("../../../src/business-logic/club");
jest.mock("../../../src/utils/check-club-exists.util");
jest.mock("../../../src/models/subscription/subscription.model");


describe('Business logic: Subscription: Create', () => {
    afterEach(async () => {
        jest.resetAllMocks();
      });
    
    const subscription = {
        name: 'name 1',
        price: 10000,
        description: 'description 1',
        clubId: 'clubId 1',
        userId: 'userId 1'
    }
    
    it('Should create a subscription', async() => {
        SubscriptionModel.create.mockReturnValue(subscription);

        ClubLogic.checkIfUserIsAdmin.mockReturnValue();
        checkClubExists.mockReturnValue();

        const result = await create({clubId: 'clubId 1', userId: 'userId 1'});

        expect(result.name).toBe('name 1');
        expect(result.price).toBe(10000);
        expect(result.description).toBe('description 1');
        expect(result.clubId).toBe('clubId 1');
        expect(result.userId).toBe('userId 1');
    });    
});