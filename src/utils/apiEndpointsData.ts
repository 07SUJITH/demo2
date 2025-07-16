import postmanCollection from "../AuthAPI.postman_collection.json";

export interface EndpointData {
  id: string;
  name: string;
  method: string;
  url: string;
  description: string;
  fullDescription: string;
  authentication: string;
  requestBody?: {
    type: string;
    example?: Record<string, unknown>;
    schema?: Record<string, unknown>;
  };
  responseExamples?: {
    status: number;
    description: string;
    body: Record<string, unknown>;
  }[];
  headers?: { key: string; value: string }[];
  pathParams?: { key: string; description: string }[];
  queryParams?: { key: string; description: string }[];
  category: string;
}

interface PostmanHeader {
  key: string;
  value?: string;
  description?: string;
}

interface PostmanItem {
  name: string;
  request?: {
    method?: string;
    url?: string | { raw?: string };
    body?: {
      mode?: string;
      raw?: string;
    };
    auth?: { type?: string };
    header?: PostmanHeader[];
  };
  description?: string;
  item?: PostmanItem[];
}

function extractEndpointFromPostman(
  item: PostmanItem,
  category: string
): EndpointData | null {
  if (!item.request) return null;

  const request = item.request;
  const method = request.method || "GET";
  const url =
    typeof request.url === "string" ? request.url : request.url?.raw || "";

  // Extract path from URL
  const path = url.replace(/^https?:\/\/[^\/]+/, "").replace(/\?.*$/, "");

  // Extract description from item description
  const fullDescription = item.description || "";

  // Extract short description from the full description (first line or first sentence)
  const shortDescription =
    fullDescription.split("\n")[0].replace(/^#\s*/, "").trim() || item.name;

  // Extract request body info
  let requestBody;
  if (request.body) {
    requestBody = {
      type: request.body.mode || "raw",
      example: request.body.raw
        ? JSON.parse(request.body.raw || "{}")
        : undefined,
    };
  }

  // Extract authentication info
  let authentication = "None";
  if (request.auth) {
    authentication = request.auth.type || "Unknown";
  } else if (
    fullDescription.includes("Authentication") ||
    fullDescription.includes("Bearer")
  ) {
    authentication = "Bearer Token";
  }

  // Extract headers
  const headers =
    request.header?.map((h: PostmanHeader) => ({
      key: h.key,
      value: h.value || h.description || "",
    })) || [];

  // Extract response examples from description
  const responseExamples = [];
  if (
    fullDescription.includes("200 OK") ||
    fullDescription.includes("Success")
  ) {
    responseExamples.push({
      status: 200,
      description: "Success",
      body: {},
    });
  }
  if (
    fullDescription.includes("400 Bad Request") ||
    fullDescription.includes("400")
  ) {
    responseExamples.push({
      status: 400,
      description: "Bad Request",
      body: {},
    });
  }
  if (
    fullDescription.includes("429") ||
    fullDescription.includes("Too Many Requests")
  ) {
    responseExamples.push({
      status: 429,
      description: "Too Many Requests",
      body: {},
    });
  }

  return {
    id: `${category}-${item.name?.replace(/\s+/g, "-").toLowerCase()}`,
    name: item.name || "Unknown",
    method,
    url: path,
    description: shortDescription,
    fullDescription,
    authentication,
    requestBody,
    responseExamples,
    headers,
    category,
  };
}

export function getApiEndpoints(): EndpointData[] {
  const endpoints: EndpointData[] = [];

  // Process postman collection items
  if (postmanCollection.item) {
    for (const folder of postmanCollection.item) {
      const category = folder.name || "General";

      if (folder.item) {
        for (const item of folder.item) {
          const endpoint = extractEndpointFromPostman(item, category);
          if (endpoint) {
            endpoints.push(endpoint);
          }
        }
      }
    }
  }

  return endpoints;
}

export function getEndpointById(id: string): EndpointData | null {
  const endpoints = getApiEndpoints();
  return endpoints.find(endpoint => endpoint.id === id) || null;
}

export function getEndpointsByCategory(): Record<string, EndpointData[]> {
  const endpoints = getApiEndpoints();
  const byCategory: Record<string, EndpointData[]> = {};

  endpoints.forEach(endpoint => {
    if (!byCategory[endpoint.category]) {
      byCategory[endpoint.category] = [];
    }
    byCategory[endpoint.category].push(endpoint);
  });

  return byCategory;
}
