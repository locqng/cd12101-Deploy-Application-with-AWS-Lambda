import { createLogger } from '../utils/logger.mjs'
import { TodosAccess } from '../dataLayer/todoAccess.mjs'
import { v4 as uuidv4 } from 'uuid'
import { AttachmentUtils } from '../fileStorage/attachmentUtils.mjs'

const logger = createLogger('businessLogic')

const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()
const bucketName = process.env.IMAGES_S3_BUCKET

export async function getTodosAsync(userId) {
  logger.info('todo - getTodoAsync')
  return todosAccess.getTodosForUserAsync(userId)
}

export async function createTodoAsync(newTodo, userId) {
  logger.info('todo - createTodoAsync')

  newTodo.todoId = uuidv4()
  newTodo.userId = userId
  newTodo.createdAt = new Date().toISOString()
  newTodo.attachmentUrl = ''
  newTodo.done = false

  await todosAccess.createTodoAsync(newTodo)
  return newTodo
}

export async function updateTodoAsync(userId, todoId, todoUpdate) {
  logger.info('todo - updateTodoAsync')

  return await todosAccess.updateTodoAsync(userId, todoId, todoUpdate)
}

export async function deleteTodoAsync(todoId, userId) {
  logger.info('todo - deleteTodoAsync')

  return await todosAccess.deleteTodoAsync(todoId, userId)
}

export async function updateAttachmentUrlTodoAsync(todoId, userId) {
  logger.info('todo - createAttacreateAttachmentPresignedUrlAsync')
  const attachmentUrl = `https://${bucketName}.s3.us-east-1.amazonaws.com/${todoId}`

  const url = attachmentUtils.getUploadUrl(todoId)
  await todosAccess.updateAttachmentUrlAsync(todoId, userId, attachmentUrl)
  return url
}
