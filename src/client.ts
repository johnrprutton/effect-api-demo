import * as HttpApiClient from "effect/unstable/httpapi/HttpApiClient"

import { Api } from "./server.js"

export const ApiClient = HttpApiClient.make(Api, {
	baseUrl: "http://localhost:3001/",
})
