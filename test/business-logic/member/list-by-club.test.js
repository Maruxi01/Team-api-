import MemberModel from "../../../src/models/member/member.model";
import listByClub from "../../../src/business-logic/member/list-by-club";
import checkIfUserIsAdmin from "../../../src/business-logic/club/check-is-admin";

jest.mock('../../../src/business-logic/club');
jest.mock('../../../src/models/member/member.model');
jest.mock('../../../src/business-logic/club/check-is-admin');

describe('Business logic: Member: List by club', () => {
    afterEach(async () => {
        jest.resetAllMocks();
      });

    const members = [
        {
            name: 'name 1',
            email: 'email 1',
            dni: 'dni 1',
            nickname: 'nickname 1',
            clubId: 'clubId 1',
            userId: 'userId 1'
        },
        {
            name: 'name 2',
            email: 'email 2',
            dni: 'dni 2',
            nickname: 'nickname 2',
            clubId: 'clubId 1',
            userId: 'userId 1'
        },
        {
            name: 'name 3',
            email: 'email 3',
            dni: 'dni 3',
            nickname: 'nickname 3',
            clubId: 'clubId 1',
            userId: 'userId 1'
        }
    ]

    it('Should return a list of members by club ', async() => {
        MemberModel.find.mockReturnValue(members);

        checkIfUserIsAdmin.mockReturnValue();

        const result = await listByClub({clubId: 'clubId 1', userId: 'userId 1'});
        expect(result).toEqual(members);
        expect(result).toHaveLength(3);

        result.forEach((member, i) =>{
            expect(member.name).toEqual(`name ${i + 1}`);
            expect(member).toHaveProperty('email');
            expect(member).toHaveProperty('dni');
            expect(member).toHaveProperty('nickname');
            expect(member).toHaveProperty('clubId');
            expect(member).toHaveProperty('userId');
        });
    });  
});