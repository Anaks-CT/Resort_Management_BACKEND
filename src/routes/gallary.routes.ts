import express from 'express'
import { addLargeBanner } from '../controllers/gallary/addLargeBanner'
import { addSmallBanner } from '../controllers/gallary/addSmallbanner'

export const gallary = express.Router()

gallary.post('/addLargeBanner', addLargeBanner)
gallary.post('/addLargeBanner', addSmallBanner)
