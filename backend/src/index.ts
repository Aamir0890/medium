import { Hono } from 'hono'
import {User} from '@prisma/client'

import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'


const app = new Hono<{
  Bindings:{
    DATABASE_URL:string;
  }
}>

app.get('/', (c) => {
  return c.text('Hello Hono!')
})


app.post('/api/v1/user/signup',(c)=>{

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())
  

  return c.text("hello")
})

app.post('/api/v1/user/signin',(c)=>{
  return c.text("hello")
})

app.post('/api/v1/blog',(c)=>{
  return c.text("hello")
})

app.put('/api/v1/blog',(c)=>{
  return c.text("hello")
})

app.get(' /api/v1/blog/:id',(c)=>{
  return c.text("hello")
})

app.get('/api/v1/blog/bulk',(c)=>{
  return c.text("hello")
})


export default app


