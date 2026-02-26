import * as Schema from "effect/Schema"

export type User = typeof UserSchema.Type
export const UserSchema = Schema.Struct({
	id: Schema.NonEmptyString,
	name: Schema.NonEmptyString,
})
