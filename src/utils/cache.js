import NodeCache from "node-cache";

export const cacheStore = new NodeCache({ stdTTL: 60 }); // 60 seconds TTL

export const cache = (key) => (req, res, next) => {
  const cached = cacheStore.get(key);

  if (cached) {
    return res.json(cached);
  }

  const originalJson = res.json.bind(res);

  res.json = (data) => {
    cacheStore.set(key, data);
    originalJson(data);
  };

  next();
};
