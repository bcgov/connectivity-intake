import getConfig from "next/config";

const runtimeConfig = getConfig()?.publicRuntimeConfig ?? {};
const baseUrl =
  runtimeConfig.NODE_ENV === "production"
    ? `https://${runtimeConfig.HOST}`
    : `http://localhost:${runtimeConfig.PORT || 3000}`;

export default async function queryData(req) {
  if (!req) {
    throw new Error(`req is missing in queryData ${JSON.stringify(req)}`);
  }
  if (!req.rawHeaders) {
    throw new Error(
      `req.rawHeaders are missing in queryData ${JSON.stringify(req)}`
    );
  }
  const oldFormDataQuery = JSON.stringify({
    query: `query OldFormDataQuery {allApplications(first: 1) {nodes {
        id 
        formData 
        status
      }
    }
  }`,
  });
  const headers = {
    "Content-Type": "application/json",
  };
  const cookie = req.rawHeaders.find((h) => h.match(/^connect\.sid=/));
  if (cookie) headers["Cookie"] = cookie;
  console.log("\n\nRequest\n\n", req.rawHeaders, "\n\n");
  console.log("\n\nCookie\n\n", cookie, "\n\n");

  const res = await fetch(`${baseUrl}/graphql`, {
    method: "POST",
    headers,
    body: oldFormDataQuery,
  });
  const response = await res.json();
  const oldFormData = response.data.allApplications.nodes[0].formData;
  const applicationId = response.data.allApplications.nodes[0].id;

  return { oldFormData, applicationId };
}
