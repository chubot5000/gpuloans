export function stringifyCustomMetadata(metadata: object) {
  // loop on all keys and stringify the values
  const stringifiedMetadata: Record<string, string> = {};
  Object.entries(metadata).forEach(([key, value]) => {
    stringifiedMetadata[key] = JSON.stringify(value);
  });

  return stringifiedMetadata;
}
