import { NodeDef, NodeAPI, Node, NodeMessageInFlow } from "node-red";
import registerClusterConfig from "./cluster-config/controller";
import registerLowerCase from "./lower-case/controller";
import registerNamespace from "./namespace/controller";

export default function (RED: NodeAPI) {
    registerLowerCase(RED);
    registerClusterConfig(RED);
    registerNamespace(RED);
}
