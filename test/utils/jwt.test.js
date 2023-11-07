import {generateToken, verifyToken} from '../../src/utils/jwt.util';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
    verify: jest.fn()
}));

describe('Utils: jwt', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should generate a token', () => {
        const payload = { userId: 1, username: 'test' };
        const mockToken = 'mockToken';

        jwt.sign.mockReturnValue(mockToken);
        const token = generateToken({data: payload});
        
        expect(token).toBe(mockToken);
        expect(jwt.sign).toHaveBeenCalledWith(payload, expect.any(String), {expiresIn: expect.any(String)});
        
    });
    it('Should verify a token', () => {
        const mockToken = 'mockToken';
        const mockPayload = { userId: 1, username: 'test' };

        jwt.verify.mockReturnValue(mockPayload);

        const payload = verifyToken(mockToken);

        expect(payload).toBe(mockPayload);
        expect(jwt.verify).toHaveBeenCalledWith(mockToken, expect.any(String));        
    });
});