import { Elysia } from "elysia"
import { config } from "../common/plugins/config"
import { connectDatabase } from "./helpers/connect"
import * as schema from "./schemas/index"

const connection = connectDatabase({
    url: config.DATABASE_URL,
    schema,
    postgres: {},
    drizzle: {
        logger: true,
    },
})

export const db = connection.db
export const pluginDB = () =>
    new Elysia({ name: "plugin-db" }).decorate("db", connection.db)
