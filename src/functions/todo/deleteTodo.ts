import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import todoService from 'src/services';

export const handler = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters.id;
    try {
        await todoService.deleteTodo(id);
        
        return formatJSONResponse({}, 204);
    } catch (err) {
        return formatJSONResponse({
            message: err
        }, 500);
    }
});
