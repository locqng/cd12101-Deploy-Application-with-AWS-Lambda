import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { deleteTodoAsync } from '../../businessLogic/todo.mjs'
import { getUserId } from '../utils.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    await deleteTodoAsync(todoId, userId)
    return {
      statusCode: 200,
      body: JSON.stringify({})
    }
  })
