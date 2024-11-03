import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from '../utils/build-route-path.js'

const database =  new Database()

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/task'),
    handler: (req, res) => {
      const { title , description } = req.body

      if(!title){
        return res.writeHead(400).end('Please, inserting title of task!')
      }

      if(!description){
        return res.writeHead(400).end('Please, inserting description of task!')
      }
      
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }
      
      database.insert('task', task)

    
      console.log(task)
      return res.writeHead(201).end()
    }
  },
  {
    method: 'GET',
    path: buildRoutePath('/task'),
    handler: (req, res) => {

      const { search } = req.query

      const task = database.select('task', search ? {
        title: search,
        description: search
      }: null)
      
      return res.end(JSON.stringify(task))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/task/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title , description } = req.body

      const task = database.find('task', id)

      if(!task){
        return res.writeHead(404).end('task not found')
      }

      if(!title){
        return res.writeHead(400).end('Please, inserting title of task!')
      }

      if(!description){
        return res.writeHead(400).end('Please, inserting description of task!')
      }

      const updatedTask = {
          ...task,
          title,
          description,
          updated_at: new Date()
      }

      console.log(updatedTask)
         
      database.update('task', id, updatedTask)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/task/:id'),
    handler: (req, res) => {
      const { id } = req.params
      
      database.delete('task', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/task/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const task = database.find('task', id)

      if(!task){
        return res.writeHead(404).end('task not found')
      }

      const updatedTask = {
        ...task,
        completed_at: new Date(),
        updated_at: new Date(),
      }

      database.update('task', id, updatedTask)

      console.log(updatedTask)

      res.end(JSON.stringify(updatedTask))
    }
  },
]