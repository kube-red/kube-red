import { NodeDef, NodeAPI, Node, NodeMessageInFlow } from "node-red";
import registerClusterConfig from "./cluster-config/node";
import registerNamespace from "./namespace/node";
import registerConfigMap from "./configmap/node";
import registerUpsert from "./upsert/node";
import registerGetter from "./getter/node";

export default function (RED: NodeAPI) {
    registerClusterConfig(RED);
    registerNamespace(RED);
    registerConfigMap(RED);
    registerUpsert(RED);
    registerGetter(RED);
}
