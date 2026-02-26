import * as Effect from "effect/Effect"
import * as HttpApiBuilder from "effect/unstable/httpapi/HttpApiBuilder"

import { UserNotFoundError } from "@/errors.js"
import type { User } from "@/schema.js"
import { Api } from "@/server.js"

const users = new Map<User["id"], User>([
	["john1", { id: "john1", name: "John" }],
	["alex1", { id: "alex1", name: "Alex" }],
])

export const UserApiLive = HttpApiBuilder.group(Api, "user", (handler) =>
	handler
		.handle("getAll", () =>
			Effect.gen(function* () {
				return users.values().toArray()
			}),
		)
		.handle("getById", ({ params }) =>
			Effect.gen(function* () {
				if (!users.has(params.id))
					return yield* new UserNotFoundError({
						message: "User not found",
						id: params.id,
					})

				return {
					id: "",
					name: "",
				}
			}),
		),
)
