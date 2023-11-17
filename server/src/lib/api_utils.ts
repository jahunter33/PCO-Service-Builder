import config from "./config";
import { Headers } from "cross-fetch";

interface QueryParams {
  [key: string]: string | number | boolean;
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD";

interface ApiResponse {
  data: any;
}

interface Body {
  data: {
    type: string;
    attributes: {
      status: string;
      notes: string;
      team_position_name: string;
      prepare_notification: boolean;
    };
    relationships: {
      person: {
        data: {
          type: string;
          id: string;
        };
      };
      team: {
        data: {
          type: string;
          id: string | undefined;
        };
      };
    };
  };
}

async function fetchWebApi(
  endpoint: string,
  method: HttpMethod,
  body?: Body,
  limit: number = 100,
  queryParams: QueryParams = {}
): Promise<ApiResponse> {
  const header: Headers = new Headers();
  header.append("Content-Type", "application/json");
  header.append(
    "Authorization",
    "Basic " + btoa(config.APP_ID + ":" + config.SECRET)
  );

  let results: any[] = [];
  let fetchedSoFar: number = 0;
  let offset: number = 0;
  let total: number = 0;

  do {
    const apiUrl: URL = new URL(
      `https://api.planningcenteronline.com/${endpoint}`
    );
    queryParams.per_page = limit;
    queryParams.offset = offset;
    for (const key in queryParams) {
      apiUrl.searchParams.append(key, queryParams[key].toString());
    }
    try {
      const response: Response = await fetch(apiUrl.toString(), {
        headers: header,
        method: method,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (method === "POST") {
        return {
          data: response,
        };
      }
      const data: any = await response.json();
      if (data && data.data && data.meta) {
        fetchedSoFar += data.data.length;
        total = data.meta.total_count;
        results = results.concat(data.data);
      } else {
        throw new Error(
          `Error: Received unexpected response. Make sure the URL is correct. Response data: ${JSON.stringify(
            data
          )}`
        );
      }
      if (data.data.length === 0 || fetchedSoFar >= total) {
        break;
      }
      offset += limit;
    } catch (error: any) {
      const newError = new Error(`Response unsuccessful: ${error.message}`);
      newError.stack = `${newError.stack}\n\nOriginal stack trace:\n${error.stack}`;
      throw newError;
    }
  } while (true);
  return {
    data: results,
  };
}

export { ApiResponse, QueryParams, Body, fetchWebApi };
