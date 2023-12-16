interface CacheProvincesTH {
  timestamp: {
    lastUpdated: Date;
  };
  data: any[];
}

interface CacheCategoriesTH {
  timestamp: {
    lastUpdated: Date;
  };
  data: any[];
}

export const cacheCategoriesTH: CacheCategoriesTH = {
  timestamp: {
    lastUpdated: new Date(),
  },
  data: [],
};

export const cacheProvincesTH: CacheProvincesTH = {
  timestamp: {
    lastUpdated: new Date(),
  },
  data: [],
};
