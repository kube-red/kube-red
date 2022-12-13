import { NodeDef, NodeAPI, Node, NodeMessageInFlow } from "node-red";
import registerLowerCase from "./lower-case/node";

export default function (RED: NodeAPI) {
    registerLowerCase(RED);
}
