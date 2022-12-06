import { NodeDef, NodeAPI, Node, NodeMessageInFlow } from "node-red";
import registerLowerCase from "./lower-case/controller";
import registerClusterConfig from "./cluster-config/controller";
import registerNamespaces from "./namespaces-function/controller";

export default function (RED: NodeAPI) {
    registerLowerCase(RED);
    registerClusterConfig(RED);
    registerNamespaces(RED);
}
