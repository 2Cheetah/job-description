import { Hono } from 'hono';
import { basicAuth } from 'hono/basic-auth'
import { logger } from 'hono/logger'

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use(logger())
app.use('/message', basicAuth({
  verifyUser: (username, password, c) => {
    return (
      username === c.env.USERNAME
      && password === c.env.PASSWORD
    )
  },
}))

app.get("/message", async (c) => {
  const llm_token = c.env.LLM_TOKEN
  console.log(llm_token)
  return c.text('Hello, user!')
});

export default app;
