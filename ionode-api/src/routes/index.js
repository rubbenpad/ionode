'use strict'

const express = require('express')
const database = require('ionode-db')
const { config } = require('ionode-tools')

async function servicesApi(app) {
  const router = express.Router()
  app.use('/api', router)

  let services = null
  let Agent = null
  let Metric = null

  if (!services) {
    services = await database(config.db)
    Agent = services.Agent
    Metric = services.Metric
  }

  router.get('/agents', async (request, response, next) => {
    try {
      const connectedAgents = await Agent.findConnected()
      response
        .status(200)
        .json({ data: connectedAgents, message: 'Connected agents' })
    } catch (error) {
      next(error)
    }
  })

  router.get('/agents/:uuid', async (request, response, next) => {
    const { uuid } = request.params

    try {
      const agent = await Agent.findByUuid(uuid)
      response.status(200).json({ data: agent, message: 'Agent found' })
    } catch (error) {
      next(error)
    }
  })

  router.get('/metrics/:uuid', async (request, response, next) => {
    const { uuid } = request.params

    try {
      const metrics = await Metric.findByAgentUuid(uuid)
      response.status(200).json({ data: metrics, message: 'Metrics listed' })
    } catch (error) {
      next(error)
    }
  })

  router.get('/metrics/:uuid/:type', async (request, response, next) => {
    const { type, uuid } = request.params

    try {
      const metrics = await Metric.findByTypeAgentUuid(type, uuid)
      response.status(200).json({ data: metrics, message: 'Metrics listed' })
    } catch (error) {
      next(error)
    }
  })
}

module.exports = servicesApi
