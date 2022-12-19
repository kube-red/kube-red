import { NodeDef, NodeAPI, Node, NodeMessageInFlow } from "node-red";
import registerLowerCase from "./lower-case/node";
import registerClusterConfig from "./cluster-config/node";
import registerNamespace from "./namespace/node";

export default function (RED: NodeAPI) {
    registerLowerCase(RED);
    registerClusterConfig(RED);
    registerNamespace(RED);
}
