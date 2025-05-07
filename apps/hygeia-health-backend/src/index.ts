import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { createYoga } from "graphql-yoga";
import { schema } from './graphql/schema'
import authRoute from './routes/auth-route'
import formRoute from './routes/form-route'
import { corsMiddleware } from "./middleware/cors";
import { errorMiddleware } from "./middleware/error";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.use(corsMiddleware)
app.use(errorMiddleware)
app.use(csrf({origin: ['https://www.hygeia-health.jakekuo.com', 'http://localhost:8788']}))

app.route('/api/auth', authRoute)
app.route('/api/form', formRoute)
// Create Yoga GraphQL handler (uses Fetch API internally)
const yoga = createYoga({
  schema,
  graphqlEndpoint: '/graphql',
  context: (context) => ({
    params: context.params,
    request: context.request,
    waitUntil: context.waitUntil
  }),
  fetchAPI: {
    Request,
    Response,
  },
});

app.all('/graphql', async (c) => {
  const response = await yoga.fetch(c.req.raw);
  return response;
});

export default app;
