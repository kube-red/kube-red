import { EditorRED } from "node-red";
import ClusterConfigEditor from "./cluster-config/editor";
import {Controller as ClusterConfigController} from "./cluster-config/types";

import UpsertEditor from "./generic/upsert/editor";
import {Controller as UpsertController} from "./generic/upsert/types";
import GetEditor from "./generic/get/editor";
import {Controller as GetController} from "./generic/get/types";
import DeleteEditor from "./generic/delete/editor";
import {Controller as DeleteController} from "./generic/delete/types";
import ListEditor from "./generic/list/editor";
import {Controller as ListController} from "./generic/list/types";
import CreateEditor from "./generic/create/editor";
import {Controller as CreateController} from "./generic/create/types";
import UpdateEditor from "./generic/update/editor";
import {Controller as UpdateController} from "./generic/update/types";

declare const RED: EditorRED;

// fetch discovered types from the backend,
// and for each type, register a kube node (i.e. deployment, nodes, pods, etc. etc. including CRDs)
// in node-red

// for type := range discoveredTypes {
//     RED.nodes.registerType("pods", PodsEditor);
// }

RED.nodes.registerType(ClusterConfigController.name, ClusterConfigEditor)
RED.nodes.registerType(UpsertController.name, UpsertEditor)
RED.nodes.registerType(GetController.name, GetEditor)
RED.nodes.registerType(DeleteController.name, DeleteEditor)
RED.nodes.registerType(ListController.name, ListEditor)
RED.nodes.registerType(CreateController.name, CreateEditor)
RED.nodes.registerType(UpdateController.name, UpdateEditor)
