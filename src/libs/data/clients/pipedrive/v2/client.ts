import { createPipedriveClient } from "../base";

import type { paths } from "./schema";

export const pipedriveClient = createPipedriveClient<paths>("/v2");
