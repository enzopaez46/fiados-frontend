export default function queryStringParser(
  queryParams: Record<string, any>,
): string {
  const queryString = new URLSearchParams();

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((val) => queryString.append(key, String(val)));
      } else {
        queryString.append(key, String(value));
      }
    }
  });

  return queryString.toString();
}
