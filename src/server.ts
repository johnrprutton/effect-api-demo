import * as Schema from "effect/Schema"
import * as HttpApi from "effect/unstable/httpapi/HttpApi"
import * as HttpApiBuilder from "effect/unstable/httpapi/HttpApiBuilder"
import * as HttpApiEndpoint from "effect/unstable/httpapi/HttpApiEndpoint"
import * as HttpApiGroup from "effect/unstable/httpapi/HttpApiGroup"

import { UserNotFoundError } from "@/errors.js"
import { UserSchema } from "@/schema.js"

export class UserApi extends HttpApiGroup.make("user")
	.add(
		HttpApiEndpoint.get("getAll", "/", {
			success: UserSchema.pipe(Schema.Array),
		}),
	)
	.add(
		HttpApiEndpoint.get("getById", "/:id", {
			params: Schema.Struct({
				id: Schema.NonEmptyString,
			}),
			success: UserSchema,
			error: UserNotFoundError,
		}),
	)
	.prefix("/user") {}

export class Api extends HttpApi.make("Api").add(UserApi).prefix("/api") {}

export const ApiLive = HttpApiBuilder.layer(Api)
