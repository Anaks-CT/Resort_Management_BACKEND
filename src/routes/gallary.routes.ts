import express from 'express'
import { addCommunityPic } from '../controllers/gallary/addCommunityPic'
import { addLargeBanner } from '../controllers/gallary/addLargeBanner'
import { addSmallBanner } from '../controllers/gallary/addSmallbanner'
import { gallaryDetails } from '../controllers/gallary/fetchGallaryDetails'

export const gallary = express.Router()

gallary.post('/addLargeBanner', addLargeBanner)
gallary.post('/addSmallBanner', addSmallBanner)
gallary.post('/addCommunityPic', addCommunityPic)
gallary.get('/getAllGallaryDetails', gallaryDetails)
