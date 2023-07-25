import { NextFunction, Request, Response } from 'express';
export const errorHandler = (error, request, response, next) => {
    console.log(`error ${error.message}`)
    const status = error.status || 400
    return response.status(status).send(error.message)
  }