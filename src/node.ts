import * as nodered from "node-red";

export interface TestNodeDef
    extends nodered.NodeDef {
    length: number;
}