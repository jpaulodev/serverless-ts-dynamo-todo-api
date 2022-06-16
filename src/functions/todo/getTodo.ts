import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import todoService from 'src/services';

export const handler = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters.id;
    try {
        const todo = await todoService.getTodo(id);

        return formatJSONResponse({
            todo
        });
    } catch (err) {
        return formatJSONResponse({
            message: err
        }, 500);
    }
});