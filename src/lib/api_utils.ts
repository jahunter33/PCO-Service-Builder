import { off } from "process";
import config from "./config";
import { Headers } from "cross-fetch";

const APP_ID: string | undefined = config.APP_ID;
const SECRET: string | undefined = config.SECRET;

interface QueryParams {
  [key: string]: string | number | boolean;
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD";

interface ApiResponse {
  data: any; // ideally this would be a generic type but each api endpoint returns different data
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
  const apiUrl: URL = new URL(
    `https://api.planningcenteronline.com/${endpoint}`
  );
  const header: Headers = new Headers();
  header.append("Content-Type", "application/json");
  header.append(
    "Authorization",
    "Basic " + btoa(config.APP_ID + ":" + config.SECRET)
  );

  let results: any[] = [];
  let fetchedSoFar: number = 0;
  let offset: number = 0;
  let total: number;

  do {
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
      const data: any = await response.json();
      fetchedSoFar += data.data.length;
      total = data.meta.total_count;
      results = results.concat(data.data);
      if (data.data.length === 0 || fetchedSoFar >= total) {
        break;
      }
      offset += limit;
    } catch (error) {
      throw new Error(`Response unsuccessful: ${error}`);
    }
  } while (true);
  return {
    data: results,
  };
}

export { ApiResponse, QueryParams, Body, fetchWebApi };
