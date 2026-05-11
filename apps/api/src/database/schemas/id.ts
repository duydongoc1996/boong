import { text } from "drizzle-orm/pg-core"
import { customAlphabet } from "nanoid"

type IdPrefix =
    // core
    | "usr_"
    | "org_"
    | "ses_"
    | "acc_"
    | "ver_"
    | "inv_"
    | "mem_"
    // example
    | "cat_"
    | "pst_"

const generator = customAlphabet(
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    12
)

export const ID = (prefix: IdPrefix) =>
    text("id")
        .$defaultFn(() => `${prefix}${generator()}`)
        .primaryKey()
