import { NodeDef, NodeAPI, Node, NodeMessageInFlow } from "node-red";
import registerLowerCase from "./lower-case/node";
import registerCLusterConfig from "./cluster-config/node";

export default function (RED: NodeAPI) {
    registerLowerCase(RED);
    registerCLusterConfig(RED);
}
