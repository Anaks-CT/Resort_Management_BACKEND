import { RequestHandler } from 'express'
import GallaryService from '../../services/gallary.service'

const gallaryService = new GallaryService()

export const addSmallBanner: RequestHandler = async (req, res, next) => {
    const { image, description1, description2, resortId } = req.body
    try {
        const response = await gallaryService.addSmallBanner(
            image,
            description1,
            description2,
            resortId
        )
        res.send({ message: 'Small banner added', data: response })
    } catch (error: any) {
        return next(error)
    }
}
