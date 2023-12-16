# Project Structure

**Overview**

This project follows a well-organized structure to enhance maintainability and clarity.

```
src
│
├── cache
│   └── estate.ts
│
├── configs
│   └── cache.ts
│
└── controllers
    └── estate
        └── search.ts
```

## Cache

1. `cacheCategoriesTH`
- `Description:` This cache stores data related to popular categories.
- `Usage:` Accessed and updated by `getPopularCategoriesTH` function.

2. `cacheProvincesTH`
- `Description:` This cache stores data related to popular provinces.
- `Usage:` Accessed and updated by `getPopularProvincesTH` function.

## Functions

`getPopularCategoriesTH`
- `Description:` Fetches and caches data related to popular categories.
- `Usage:` Called to retrieve or update `cacheCategoriesTH`.

`getPopularProvincesTH`
- `Description:` Fetches and caches data related to popular provinces.
- `Usage:` Called to retrieve or update `cacheProvincesTH`.
