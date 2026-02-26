import * as Schema from "effect/Schema"

import { UserSchema } from "@/schema.js"

export class UserNotFoundError extends Schema.TaggedErrorClass<UserNotFoundError>()(
	"UserNotFound",
	{
		message: Schema.Literal("User not found"),
		id: UserSchema.fields.id,
	},
	{
		httpApiStatus: 404,
	},
) {}
