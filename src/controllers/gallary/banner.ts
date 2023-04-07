import GallaryService from "../../services/gallary.service";
import AsyncHandler from "express-async-handler";

const gallaryService = new GallaryService();
type BannerType = "largeBanner" | "smallBanner";

export const addBanner = AsyncHandler(async (req, res) => {
    const { image, description1, description2, banner } = req.body;
    const { resortId } = req.params;
    const updatedData = await gallaryService.addBanner(
        banner,
        image,
        description1,
        description2,
        resortId
    );
    res.json({ message: "Banner added successfully", data: updatedData });
});

export const deleteBanner = AsyncHandler( async (req, res) => {
    const { resortId, largeBannerId, smallBannerId } = req.params;
    const banner: "largeBanner" | "smallBanner" = req.params
        .banner as BannerType;
        const updatedData = await gallaryService.deleteBanner(
            banner,
            resortId,
            banner === "largeBanner" ? largeBannerId : smallBannerId
        );
        res.json({ message: "Image deleted successfully", data: updatedData });
});

export const editBannerDetails = AsyncHandler( async (req, res) => {
    const { resortId, largeBannerId, smallBannerId } = req.params;
    const { description1, description2, banner } = req.body;
        const updatedData = await gallaryService.editBannerDetails(
            banner,
            resortId,
            banner === "largeBanner" ? largeBannerId : smallBannerId,
            description1,
            description2
        );
        res.json({ message: "Banner edited successfully", data: updatedData });
});

export const editBannerImage = AsyncHandler( async (req, res) => {
    const { resortId, largeBannerId, smallBannerId } = req.params;
    const { image, banner } = req.body;
        const updatedData = await gallaryService.editBannerImage(
            banner,
            resortId,
            banner === "largeBanner" ? largeBannerId : smallBannerId,
            image
        );
        res.json({ message: "Banner edited successfully", data: updatedData });
});
