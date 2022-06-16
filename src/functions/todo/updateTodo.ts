import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import todosService from '../../services';

export const handler = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters.id;
    try {
        const todo = await todosService.updateTodo(id, { status: (event.body as any).status });

        return formatJSONResponse({
            id,
            todo
        });
    } catch (err) {
        return formatJSONResponse({
            message: err
        }, 500);
    }
});