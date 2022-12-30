import { NodeDef, NodeAPI, Node, NodeMessageInFlow } from "node-red";
import registerClusterConfig from "./cluster-config/node";
import registerUpsert from "./generic/upsert/node";
import registerGet from "./generic/get/node";
import registerDelete from "./generic/delete/node";
import registerList from "./generic/list/node";
import registerCreate from "./generic/create/node";
import registerUpdate from "./generic/update/node";

export default function (RED: NodeAPI) {
    registerClusterConfig(RED);
    registerUpsert(RED);
    registerGet(RED);
    registerDelete(RED);
    registerList(RED);
    registerCreate(RED);
    registerUpdate(RED);
}
