import { formatJSONResponse } from '@libs/api-gateway';
import { v4 } from 'uuid';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import todosService from '../../services';

export const handler = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = v4();

        const todo = await todosService.createTodo({
            todosId: id,
            title: (event.body as any).title,
            description: (event.body as any).description,
            createdAt: new Date().toISOString(),
            status: false
        });

        return formatJSONResponse({
            todo
        }, 201);
    } catch (err) {
        return formatJSONResponse({
            message: err
        }, 500);
    }
});