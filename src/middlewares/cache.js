import { redis } from "../config/redis.js";

export const cache = (key) => async (req, res, next) => {
  const cached = await redis.get(key);

  if (cached) {
    return res.json(JSON.parse(cached));
  }

  res.sendResponse = res.json;
  res.json = (data) => {
    redis.set(key, JSON.stringify(data), "EX", 60);
    res.sendResponse(data);
  };

  next();
};
