import { EditorRED } from "node-red";
import ClusterEditorBasic from "./cluster-config/editor";
import * as CreateNamespaceEditor from "./create-namespace/editor";
import * as ListNamespacesEditor from "./list-namespaces/editor";

import * as CreateNamespace from "./create-namespace/types";
import * as ListNamespaces from "./list-namespaces/types";

import * as ClusterConfig from "./cluster-config/types";


declare const RED: EditorRED;

// fetch discovered types from the backend,
// and for each type, register a kube node (i.e. deployment, nodes, pods, etc. etc. including CRDs)
// in node-red

// for type := range discoveredTypes {
//     RED.nodes.registerType("pods", PodsEditor);
// }

RED.nodes.registerType(ClusterConfig.Controller.name, ClusterEditorBasic);
RED.nodes.registerType(CreateNamespace.Controller.name, CreateNamespaceEditor.default);
RED.nodes.registerType(ListNamespaces.Controller.name, ListNamespacesEditor.default);
