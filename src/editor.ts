import { EditorRED } from "node-red";
import ClusterEditorBasic from "./cluster-config/editor";
import NamespaceEditor from "./create-namespace/editor";
import * as NamespaceCreate from "./create-namespace/types";
import * as ClusterConfig from "./cluster-config/types";


declare const RED: EditorRED;

// fetch discovered types from the backend,
// and for each type, register a kube node (i.e. deployment, nodes, pods, etc. etc. including CRDs)
// in node-red

// for type := range discoveredTypes {
//     RED.nodes.registerType("pods", PodsEditor);
// }

RED.nodes.registerType(ClusterConfig.Controller.name, ClusterEditorBasic);
RED.nodes.registerType(NamespaceCreate.Controller.name, NamespaceEditor);
