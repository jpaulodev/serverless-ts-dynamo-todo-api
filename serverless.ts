import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
	service: 'aws-serverless-typescript-api',
	frameworkVersion: '3',
	plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dynamodb-local'],

	provider: {
		name: 'aws',
		runtime: 'nodejs14.x',
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
			NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
		},
		iam: {
			role: {
				statements: [{
					Effect: "Allow",
					Action: [
						"dynamodb:DescribeTable",
						"dynamodb:Query",
						"dynamodb:Scan",
						"dynamodb:GetItem",
						"dynamodb:PutItem",
						"dynamodb:UpdateItem",
						"dynamodb:DeleteItem",
					],
					Resource: "arn:aws:dynamodb:us-east-1:*:table/TodosTable",
				}],
			},
		},
	},

	functions: { 
		getAllTodos: {
			handler: 'src/functions/todo/handlers.getAllTodos',
			events: [{
				http: {
					method: 'get',
					path: 'todo/',
				},
			}],
		},
		createTodo: {
			handler: 'src/functions/todo/handlers.createTodo',
			events: [{
				http: {
					method: 'post',
					path: 'todo/',
				},
			}],
		},
		getTodo: {
			handler: 'src/functions/todo/handlers.getTodo',
			events: [{
				http: {
					method: 'get',
					path: 'todo/{id}',
				},
			}],
		},
		updateTodo: {
			handler: 'src/functions/todo/handlers.updateTodo',
			events: [{
				http: {
					method: 'put',
					path: 'todo/{id}',
				},
			}],
		},
		deleteTodo: {
			handler: 'src/functions/todo/handlers.deleteTodo',
			events: [{
				http: {
					method: 'delete',
					path: 'todo/{id}',
				},
			}],
		}
	},
	package: { individually: true },
	custom: {
		esbuild: {
			bundle: true,
			minify: false,
			sourcemap: true,
			exclude: ['aws-sdk'],
			target: 'node14',
			define: { 'require.resolve': undefined },
			platform: 'node',
			concurrency: 10,
		},
		dynamodb: {
			start: {
				port: 5000,
				inMemory: true,
				migrate: true,
			},
			stages: "dev"
		}
	},

	resources: {
		Resources: {
			TodosTable: {
				Type: "AWS::DynamoDB::Table",
				Properties: {
					TableName: "TodosTable",
					AttributeDefinitions: [{
						AttributeName: "todosId",
						AttributeType: "S",
					}],
					KeySchema: [{
						AttributeName: "todosId",
						KeyType: "HASH"
					}],
					ProvisionedThroughput: {
						ReadCapacityUnits: 1,
						WriteCapacityUnits: 1
					},
				}
			}
		}
	}
};

module.exports = serverlessConfiguration;
