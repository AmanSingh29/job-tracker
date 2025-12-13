"use server";

const API_HOST = process.env.NEXT_PUBLIC_SERVER_ENDPOINT;

export async function fetchData(
  url: string,
  method = "GET",
  ttlInHrs = 0,
  body: any = null,
  headers = {},
  nextCacheConfig: any = {}
) {
  const config: any = {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    mode: "cors",
    next: { revalidate: 3600 * ttlInHrs, ...nextCacheConfig },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_HOST}${url}`, config);
  if (!response.ok) {
    return response.text().then((error) => {
      const { error: errorObject = {}, ...rest } = JSON.parse(error);
      if (Object.keys(errorObject).length === 0) {
        throw { error: JSON.parse(error) };
      }

      throw { error: errorObject, ...rest };
    });
  } else {
    return await response.json();
  }
}
