import dynamoDBClient from '../model';
import TodoService from './todoService';

const todoService = new TodoService(dynamoDBClient());

export default todoService;
