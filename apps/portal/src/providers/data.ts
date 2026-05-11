import dataProvider from "@bunti/rest-adapter"
import { API_URL } from "./constants"

// const fake = "https://api.fake-rest.refine.dev";

export const restProvider = dataProvider(API_URL)
