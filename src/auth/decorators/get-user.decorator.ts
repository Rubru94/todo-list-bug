import {
    createParamDecorator,
    ExecutionContext,
    InternalServerErrorException,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        if (!user)
            throw new InternalServerErrorException('User not found (request)');

        // If data is provided, return the specific property of the user
        return data ? user?.[data] : user;
    },
);
