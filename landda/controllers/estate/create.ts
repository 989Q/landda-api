import mongoose from 'mongoose';
import Estate from '../../models/estate';
import { Request, Response } from 'express';
import { uploadToWasabi } from '../../middlewares/wasabi';
import { generateImageId } from '../../utils/commons/createId';
import { generateUniqueEstateId } from '../../utils/commons/createUniqueId';

export const uploadImages = async (req: any, res: any) => {
  console.log('request files: ', req.files);
  const imageUrls: string[] = [];

  if (req.files && req.files.length > 0) {
    for (let i = 0; i < req.files.length; i++) {
      const key = `${generateImageId()}.jpg`;

      // uploadToWasabi(key, req.files[i].buffer).then((result) => {
      //   console.log("uploaded image url", result);
      // });
      const imageUrl = await uploadToWasabi(key, req.files[i].buffer);
      imageUrls.push(imageUrl);
    }
  }

  res.json({
    msg: `${req.files.length} Images uploaded successfully`,
    imageUrls: imageUrls,
  });
};

// doing
export const createEstate = async (req: Request, res: Response) => {
  // console.log("req.body: ", req.body);
  const { desc, maps } = req.body;
  const images = desc.images; // extract images array from request body
  const user = req.body.user;

  try {
    // generate unique estateId
    const estateId = await generateUniqueEstateId();

    // upload images to Wasabi
    await uploadToWasabi(images.originalname, images.buffer);

    const estate = new Estate({
      _id: new mongoose.Types.ObjectId(),
      head: {
        estateId: estateId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      desc,
      maps,
      user,
    });

    const savedEstate = await estate.save();

    res.status(201).json({ estate: savedEstate });
  } catch (error) {
    console.error('Error in createEstate:', error);
    res.status(500).json({ error: 'Internal Server Error.' });
  }
};

// doing
export const updateEstate = async (req: Request, res: Response) => {
  const estateId = req.params.estateId;
  console.log('estateId ', estateId);

  try {
    // find estate by Id
    const estate = await Estate.findOne({ 'head.estateId': estateId });

    if (!estate) {
      return res.status(404).json({ message: 'Estate not found' });
    }

    if (req.body.desc) {
      // append new image URLs to the existing images array
      if (req.body.desc.images && Array.isArray(req.body.desc.images)) {
        req.body.desc.images.forEach((imageUrl: string) => {
          estate.desc.images.push(imageUrl);
        });
      }
      // handle other desc properties as needed
      estate.desc = { ...estate.desc, ...req.body.desc };
    }

    // update estate properties based on requirements
    if (req.body.head) {
      estate.head = { ...estate.head, ...req.body.head };
    }
    if (req.body.desc) {
      estate.desc = { ...estate.desc, ...req.body.desc };
    }
    if (req.body.maps) {
      estate.maps = { ...estate.maps, ...req.body.maps };
    }

    // save updated estate
    const updatedEstate = await estate.save();

    return res.status(200).json({ estate: updatedEstate });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteEstate = async (req: Request, res: Response) => {
  const estateId = req.params.estateId;

  try {
    // find estate by ID and remove it
    const deletedEstate = await Estate.findOneAndRemove({
      'head.estateId': estateId,
    });

    if (!deletedEstate) {
      return res.status(404).json({ message: 'Estate not found' });
    }

    return res.status(200).json({ message: 'Estate deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
