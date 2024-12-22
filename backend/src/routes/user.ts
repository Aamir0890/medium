import { Hono } from "hono"
import {User} from '@prisma/client'

import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'

export const userRoutes=new Hono<{
    Bindings:{
        DATABASE_URL:string;
        JWT_SECRET:string
      }
}>()



userRoutes.post('/signup',async(c)=>{
    const body=await c.req.json()
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
    
   try {
    const user=await prisma.user.create({
      data:{
        email:body.email,
        password:body.password,
        name:body.name
      }
    })
       const jwt=await sign({id:user.id},c.env.JWT_SECRET)
     
    return c.text(jwt)
   } catch (error) {
    c.status(403)
    console.log(error)
      return c.text("User already exist with emial")
   }
  })
  
  
  userRoutes.post('/signin',async(c)=>{
    const body=await c.req.json()
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())
    
   try {
    const user=await prisma.user.findFirst({
      where:{
        email:body.email,
        password:body.password,
        
      }
    })
      if(!user){
        c.status(403)
      return c.text("Incorrect credentials")
      }
      const jwt=await sign({id:user.id},c.env.JWT_SECRET)
     
      return c.text(jwt)
     
   } catch (error) {
    c.status(403)
   
      return c.text("User already exist with emial")
   }
  })
  