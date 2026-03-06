import { createPipedriveClient } from "../base";

import type { paths } from "./schema";

export const pipedriveClientV1 = createPipedriveClient<paths>("/v1");
