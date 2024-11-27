import { createLogger } from '../utils/logger.mjs'
import AWS from 'aws-sdk'
import AWSXRay from 'aws-xray-sdk'

const logger = createLogger('todoAccess')
const XAWS = AWSXRay.captureAWS(AWS)
const docClient = new XAWS.DynamoDB.DocumentClient()
const TODOS_TABLE = process.env.TODOS_TABLE
const TODOS_INDEX = process.env.INDEX_NAME

export class TodosAccess {
  async getTodosForUserAsync(userId) {
    logger.info('todoAccess - getTodosForUserAsync')

    const result = await docClient
      .query({
        TableName: TODOS_TABLE,
        IndexName: TODOS_INDEX,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    return result.Items
  }

  async createTodoAsync(todo) {
    logger.info('todoAccess - createTodo')

    const result = await docClient
      .put({
        TableName: TODOS_TABLE,
        Item: todo
      })
      .promise()

    logger.info(`createTodo result: ${result}`)
  }

  async updateTodoAsync(userId, todoId, updateItem) {
    logger.info('todoAccess - updateTodoAsync')

    await docClient
      .update({
        TableName: TODOS_TABLE,
        Key: {
          todoId,
          userId
        },
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeValues: {
          ':name': updateItem.name,
          ':dueDate': updateItem.dueDate,
          ':done': updateItem.done
        },
        ExpressionAttributeNames: {
          '#name': 'name'
        },
        ReturnValues: 'UPDATED_NEW'
      })
      .promise()
    return updateItem
  }

  async deleteTodoAsync(todoId, userId) {
    logger.info('todoAccess - deleteTodoAsync')

    const result = await docClient
      .delete({
        TableName: TODOS_TABLE,
        Key: {
          todoId,
          userId
        }
      })
      .promise()

    logger.info(`deleteTodo result: ${result}`)
    return result
  }

  async updateAttachmentUrlAsync(todoId, userId, attachmentUrl) {
    logger.info('todoAccess - updateAttachmentUrlAsync')

    await docClient
      .update({
        TableName: TODOS_TABLE,
        Key: {
          todoId,
          userId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': attachmentUrl
        },
        ReturnValues: 'ALL_NEW'
      })
      .promise()
  }
}
