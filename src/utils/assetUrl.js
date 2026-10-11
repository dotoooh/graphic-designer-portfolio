const externalAsset = /^(?:https?:|data:|blob:|\/\/)/i;

export default function assetUrl(path) {
  if (!path || externalAsset.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}
