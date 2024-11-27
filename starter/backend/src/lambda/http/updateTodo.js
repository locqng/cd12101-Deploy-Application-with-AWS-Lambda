import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { updateTodoAsync } from '../../businessLogic/todo.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId
    const updatingTodo = JSON.parse(event.body)
    const userId = getUserId(event)
    await updateTodoAsync(userId, todoId, updatingTodo)
    return {
      statusCode: 200,
      body: JSON.stringify({})
    }
  })
