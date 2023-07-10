require("dotenv").config({ path: "../../.env" });

const APP_ID = process.env.APPLICATION_ID;
const SECRET = process.env.SECRET;

async function fetchWebApi(
  endpoint,
  method,
  body = undefined,
  total = 1000,
  queryParams = {}
) {
  let apiUrl = new URL(`https://api.planningcenteronline.com/${endpoint}`);
  let headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Authorization", "Basic " + btoa(APP_ID + ":" + SECRET));

  queryParams["per_page"] = total;
  for (let key in queryParams) {
    apiUrl.searchParams.append(key, queryParams[key]);
  }

  try {
    const response = await fetch(apiUrl, {
      headers: headers,
      method: method,
      body: JSON.stringify(body),
    });

    return response.json();
  } catch (error) {
    console.error(error);
  }
}

module.exports = { fetchWebApi };
