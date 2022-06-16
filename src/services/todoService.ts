import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import Todo from 'src/model/Todo';

export default class TodoService {
    private TableName: string = 'TodosTable';

    constructor(private docClient: DocumentClient) {}

    async getAllTodos(): Promise<Todo[]> {
        const todos = await this.docClient.scan({
            TableName: this.TableName
        }).promise();

        return todos.Items as Todo[];
    }

    async createTodo(todo: Todo): Promise<Todo> {
        await this.docClient.put({
            TableName: this.TableName,
            Item: todo
        }).promise();

        return todo;
    }

    async getTodo(id: string): Promise<Todo> {
        const todo = await this.docClient.get({
            TableName: this.TableName,
            Key: {
                todosId: id
            }
        }).promise();

        if (!todo) {
            throw new Error('Id does not exist');
        }

        return todo.Item as Todo;
    }

    async updateTodo(id: string, todo: Partial<Todo>): Promise<Todo> {
        const updated = await this.docClient.update({
            TableName: this.TableName,
            Key: {
                todosId: id
            },
            UpdateExpression: 'set #status = :status',
            ExpressionAttributeNames: {
                '#status': 'status'
            },
            ExpressionAttributeValues: {
                ':status': todo.status
            },
            ReturnValues: 'ALL_NEW'
        }).promise();

        return updated.Attributes as Todo;
    }

    deleteTodo(id: string): Promise<any> {
        return this.docClient.delete({
            TableName: this.TableName,
            Key: {
                todosId: id
            }
        }).promise();
    }
}