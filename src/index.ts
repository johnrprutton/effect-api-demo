import * as Effect from "effect/Effect"
import * as Layer from "effect/Layer"
import * as HttpRouter from "effect/unstable/http/HttpRouter"
import * as NodeFileSystem from "@effect/platform-node/NodeFileSystem"
import * as NodeHttpClient from "@effect/platform-node/NodeHttpClient"
import * as NodeHttpPlatform from "@effect/platform-node/NodeHttpPlatform"
import * as NodeHttpServer from "@effect/platform-node/NodeHttpServer"
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"

import { createServer } from "node:http"

import { ApiClient } from "@/client.js"
import { UserApiLive } from "@/implementation.js"
import { ApiLive } from "@/server.js"

const FileSystem = NodeFileSystem.layer

const HttpServer = NodeHttpServer.layer(createServer, {
	port: 3001,
})

const RunServer = HttpRouter.serve(ApiLive)
	.pipe(Layer.orDie, Layer.launch)
	.pipe(Effect.withLogSpan("[SERVER] "))

const RunClient = Effect.gen(function* () {
	const api = yield* ApiClient

	const users = yield* api.user.getAll()
	yield* Effect.log("Get all users", users)

	yield* Effect.log("Getting non-existent user by id")
	yield* api.user
		.getById({ params: { id: "non-existent-user-id" } })
		.pipe(
			Effect.catchTag("UserNotFound", (e) =>
				Effect.logError(
					"Instead of blowing up, we can handle this error gracefully",
					{ _tag: e._tag, message: e.message, id: e.id },
				),
			),
		)
}).pipe(Effect.withLogSpan("[CLIENT] "))

NodeRuntime.runMain(
	Effect.gen(function* () {
		yield* Effect.forkChild(RunServer)

		yield* Effect.sleep("1 second")
		yield* RunClient
	}).pipe(
		Effect.provide([
			UserApiLive,
			FileSystem,
			HttpServer,
			NodeHttpPlatform.layer,
			NodeHttpClient.layerUndici,
		]),
	),
)
