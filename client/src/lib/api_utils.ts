import { Headers } from "cross-fetch";

interface QueryParams {
  [key: string]: string | number | boolean;
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD";

interface ApiResponse {
  status: number;
  data?: any; // ideally this would be a more specific type but each api endpoint returns different data
  error?: string;
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

async function fetchLocalApi(
  endpoint: string,
  method: HttpMethod = "GET",
  body?: Body
): Promise<ApiResponse> {
  const header: Headers = new Headers();
  header.append("Content-Type", "application/json");

  const apiUrl: URL = new URL(`http://localhost:3000${endpoint}`);

  try {
    const response: Response = await fetch(apiUrl.toString(), {
      headers: header,
      method: method,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = response.json();
      return {
        status: response.status,
        data: errorData,
        error: "Something went wrong", //errorData.message is not working
      };
    }

    const data = await response.json();

    return {
      status: response.status,
      data: data,
    };
  } catch (error) {
    throw new Error(`Response unsuccessful: ${error}`);
  }
}

export { ApiResponse, QueryParams, Body, fetchLocalApi };
