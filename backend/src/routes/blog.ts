import { Hono } from 'hono'

import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'


export const blogRoutes=new Hono<{
  Bindings:{
        DATABASE_URL:string;
        JWT_SECRET:string
      },
      Variables:{
        userId:string
        
      }
}>()
   

 let userId:string

blogRoutes.use('/*',async(c,next)=>{
   const token=c.req.header("authorization")|| "" ;
   const user=await verify(token,c.env.JWT_SECRET)||"";
   console.log(token)
   if(user && typeof user.id==='string'){
      userId=user.id
   await next();

   }else{
    c.status(403)
    return c.json({
        message:"You are not logged in"
    })
   }
})

blogRoutes.post('/',async(c)=>{
    const body=await c.req.json();
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    const authorId=userId
    const blog=await prisma.post.create({
        data:{
            title:body.title,
            content:body.content,
            authorId:authorId
        }
    })
    
    return c.json({
        id:blog.id
    })
  })
  
  blogRoutes.put('/',async(c)=>{
    const body=await c.req.json();
    const authorId=userId;

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
    const blog=await prisma.post.update({
       where:{
        id:body.id
       },
       data:{
        title:body.title,
        content:body.content
       }
    })
    
    return c.json({id:blog.id})
  })
  
  blogRoutes.get('/',async(c)=>{
    const body=await c.req.json();

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
    
try {
    const blog=await prisma.post.findFirst({
        where:{
         id:body.id
        }
     })
     return c.json({
        blog
     })
} catch (error) {
    c.status(404);
    return c.json({
        message:"Error while fetcign data not found"
    })
}  
  })
  
  
  blogRoutes.get('/bulk',async(c)=>{

   const body=await c.req.json();
   const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())



// todo add pagination
const data=await prisma.post.findMany()
  return c.json({data})
  })
  