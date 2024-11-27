import { getUserId } from '../utils.mjs'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createTodoAsync } from '../../businessLogic/todo.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const newTodo = JSON.parse(event.body)
    const userId = getUserId(event)
    const newIitem = await createTodoAsync(newTodo, userId)

    return {
      statusCode: 200,
      body: JSON.stringify({ item: newIitem })
    }
  })
