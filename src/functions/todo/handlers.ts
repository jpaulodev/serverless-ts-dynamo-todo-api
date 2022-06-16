import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 } from 'uuid';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import todosService from '../../services';
import todoService from '../../services';

export const getAllTodos = middyfy(async (): Promise<APIGatewayProxyResult> => {
    const todos = await todosService.getAllTodos();

    return formatJSONResponse({
        todos
    });
});

export const createTodo = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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

export const getTodo = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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

export const updateTodo = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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

export const deleteTodo = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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
