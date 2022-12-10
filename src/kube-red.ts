import { NodeDef, NodeAPI, Node, NodeMessageInFlow } from "node-red";
import registerClusterConfig from "./cluster-config/controller";
import registerNamespace from "./create-namespace/controller";

export default function (RED: NodeAPI) {
    registerClusterConfig(RED);
    registerNamespace(RED);
}
