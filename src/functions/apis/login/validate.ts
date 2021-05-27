import { Validation } from '../../../libs/Validation';
import { joi } from '../../../libs/Joi';
import { LoginRequest } from './requests';

export default (request: LoginRequest): LoginRequest => {
    const schema = joi
        .object({
            email: joi.string().email(),
            mobile: joi
                .string()
                .regex(/^09\d{9}$/)
                .messages({ 'string.pattern.base': `Phone number must have 11 digits (Format: 09XXXXXXXXX).` }),
            password: joi.string().required(),
        })
        .required()
        .xor('email', 'mobile');

    const validate = new Validation<LoginRequest>(schema);
    return validate.validate(request);
};
