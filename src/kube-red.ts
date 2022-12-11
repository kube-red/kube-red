import { NodeDef, NodeAPI, Node, NodeMessageInFlow } from "node-red";
import registerClusterConfig from "./cluster-config/controller";
import registerCreateNamespace from "./create-namespace/controller";
import registerListNamespaces from "./list-namespaces/controller";
import registerNamespace from "./namespace/controller";

export default function (RED: NodeAPI) {
    registerClusterConfig(RED);
    registerCreateNamespace(RED);
    registerListNamespaces(RED);
    registerNamespace(RED);
}
