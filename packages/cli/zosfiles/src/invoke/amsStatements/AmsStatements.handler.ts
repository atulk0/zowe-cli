/*
* This program and the accompanying materials are made available under the terms of the
* Eclipse Public License v2.0 which accompanies this distribution, and is available at
* https://www.eclipse.org/legal/epl-v20.html
*
* SPDX-License-Identifier: EPL-2.0
*
* Copyright Contributors to the Zowe Project.
*
*/

import { AbstractSession, IHandlerParameters, TextUtils } from "@zowe/imperative";
import { ZosFilesConstants } from "../../../../../../packages/zosfiles/src/constants/ZosFiles.constants";
import { IZosFilesResponse } from "../../../../../../packages/zosfiles/src/doc/IZosFilesResponse";
import { Invoke } from "../../../../../../packages/zosfiles/src/methods/invoke";
import { ZosFilesBaseHandler } from "../../ZosFilesBase.handler";
import { IZosFilesOptions } from "../../../../../../packages/zosfiles/src/doc/IZosFilesOptions";

/**
 * Handler to create a PDS data set
 * @export
 */
export default class AmsStatementsHandler extends ZosFilesBaseHandler {
    public async processWithSession(commandParameters: IHandlerParameters, session: AbstractSession): Promise<IZosFilesResponse> {
        let response: IZosFilesResponse;
        const zosFilesOptions: IZosFilesOptions = {responseTimeout: commandParameters.arguments.responseTimeout};

        const statements = TextUtils
            .wordWrap(commandParameters.arguments.controlStatements, ZosFilesConstants.MAX_AMS_LINE - ZosFilesConstants.MAX_AMS_BUFFER)
            .split(/\r?\n/);
        for (let stIdx = 0; stIdx < statements.length - 1; ++stIdx) {
            statements[stIdx] += " -";
        }

        response = await Invoke.ams(session, statements, zosFilesOptions);
        commandParameters.response.console.log(TextUtils.prettyJson(response.apiResponse));

        return response;
    }
}