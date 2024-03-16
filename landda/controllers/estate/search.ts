import Estate from "../../models/estate";
import { Request, Response } from "express";
import { EstateDescStatus, EstatePostStatus } from "../../utils/types";
import { updateEstateViews } from "../../utils/updateView";

export const getEstateById = async (req: Request, res: Response) => {
  const estateId = req.params.estateId;

  try {
    const estate = await Estate.findOne({ "head.estateId": estateId })
      .populate({
        path: "user",
        select: "-_id acc.userID acc.verified info.image info.name info.work subs.access",
      })
      .select("-__v");
    if (estate) {
      // update views
      updateEstateViews(estate);
      // save changes
      await estate.save();

      res.status(200).json({ estate });
    } else {
      res.status(404).json({ message: "not found estate" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const getPopularCategoriesTH = async (req: Request, res: Response) => {
  try {
    // define popular categories
    const popularCategories = [
      { type: 'land', status: EstateDescStatus.Sale, category: 'landForSale' },
      { type: 'condo', status: EstateDescStatus.Sale, category: 'condoForSale' },
      { type: 'condo', status: EstateDescStatus.RentPerMonth, category: 'condoForRent' },
      { type: 'house', status: EstateDescStatus.Sale, category: 'houseForSale' },
      { type: 'condo', titleOrAboutIncludes: ['bts'], category: 'condoNearBTS' },
      { type: 'condo', titleOrAboutIncludes: ['mrt'], category: 'condoNearMRT' },
      { type: 'all', titleOrAboutIncludes: ['new', 'ใหม่'], category: 'newRealEstateProject' },
    ];

    // create array to store results for each category
    const results: { category: string; type: string; status: any; count: number }[] = [];

    // iterate over popular categories and fetch counts
    for (const category of popularCategories) {
      let query: Record<string, any> = {
        'head.post': EstatePostStatus.Active,
        'desc.status': category.status,
      };

      if (category.type !== 'all') {
        query['desc.type'] = category.type;
      }

      if (category.titleOrAboutIncludes) {
        query = {
          ...query,
          $or: category.titleOrAboutIncludes.map(keyword => ({
            $or: [
              { 'desc.title': { $regex: keyword, $options: 'i' } },
              { 'desc.about': { $regex: keyword, $options: 'i' } },
            ],
          })),
        };
      }

      const count = await Estate.countDocuments(query);

      results.push({
        category: category.category,
        type: category.type,
        status: category.status,
        count,
      });
    }

    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getPopularProvincesTH = async (req: Request, res: Response) => {
  try {
    const popularProvinces = [
      'Bangkok',
      'Nonthaburi',
      'Pathum Thani',
      'Chiang Mai',
      'Chiang Rai',
      'Phuket',
      'Chonburi',
    ];

    // aggregate to count number of estates in each popular province
    const provinceCounts = await Estate.aggregate([
      {
        $match: {
          'head.post': EstatePostStatus.Active, 
          'maps.province': { $in: popularProvinces },
        },
      },
      {
        $group: {
          _id: '$maps.province',
          count: { $sum: 1 },
        },
      },
    ]);

    // create map to store results
    const provinceCountsMap = new Map<string, number>();
    provinceCounts.forEach((result: { _id: string; count: number }) => {
      provinceCountsMap.set(result._id, result.count);
    });

    // prepare final result
    const results = popularProvinces.map((province) => ({
      province,
      count: provinceCountsMap.get(province) || 0,
    }));

    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// ________________________________________ searching

export const searchEstate = async (req: Request, res: Response) => {
  const {
    keyword,
    location,
    findStatus,
    findType,
    minBed,
    minBath,
    minPrice,
    maxPrice,
    sorting,
  } = req.query;
  const page = 1;
  const pageSize = 12;
  const searchQuery: any = {
    "head.post":  EstatePostStatus.Active
  };

  if (keyword && keyword.toString().length <= 60) {
    searchQuery["$or"] = [
      { "desc.title": { $regex: keyword, $options: "i" } },
      { "desc.about": { $regex: keyword, $options: "i" } },
      { "maps.address": { $regex: keyword, $options: "i" } },
      { "maps.postcode": { $regex: keyword, $options: "i" } },
    ];
  }
  if (location && location.toString().length <= 30) {
    searchQuery["$or"] = [
      { "maps.subdistrict": { $regex: location, $options: "i" } },
      { "maps.district": { $regex: location, $options: "i" } },
      { "maps.province": { $regex: location, $options: "i" } },
      { "maps.country": { $regex: location, $options: "i" } },
    ];
  }
  if (findStatus) {
    const statusValues = (findStatus as string).split(",");
    searchQuery["desc.status"] = { $in: statusValues };
  }
  if (findType) {
    const typeValues = (findType as string).split(",");
    searchQuery["desc.type"] = { $in: typeValues };
  }
  if (minBed) {
    searchQuery["desc.bed"] = { $gte: Number(minBed) };
  }
  if (minBath) {
    searchQuery["desc.bath"] = { $gte: Number(minBath) };
  }
  if (minPrice && maxPrice) {
    searchQuery["desc.price"] = {
      $gte: Number(minPrice),
      $lte: Number(maxPrice),
    };
  } else if (minPrice) {
    searchQuery["desc.price"] = { $gte: Number(minPrice) };
  } else if (maxPrice) {
    searchQuery["desc.price"] = { $lte: Number(maxPrice) };
  }

  let sortOption: any = {};
  switch (sorting) {
    case "lowestPrice":
      sortOption = { "desc.price": 1 };
      break;
    case "highestPrice":
      sortOption = { "desc.price": -1 };
      break;
    case "oldestDate":
      sortOption = { "head.updatedAt": 1 };
      break;
    case "newestDate":
      sortOption = { "head.updatedAt": -1 };
      break;
    case "bedroomAscending":
      sortOption = { "desc.bed": 1 };
      break;
    case "bedroomDescending":
      sortOption = { "desc.bed": -1 };
      break;
    default:
      // default sorting or no sorting
      break;
  }

  try {
    // calculate skip value for pagination
    const skip = (Number(page) - 1) * pageSize;

    // calculate total number of records without pagination
    const totalRecords = await Estate.countDocuments(searchQuery);

    // search and retrieve estates
    const estates = await Estate.find(searchQuery)
      .populate({
        path: "user",
        select: "-_id acc.userID acc.verified info.image info.name info.work subs.access",
      })
      .select("-__v")
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({ estates, totalRecords });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error });
  }
};
