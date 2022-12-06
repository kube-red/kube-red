import { EditorRED } from "node-red";
import LowerCaseEditor from "./lower-case/editor";
import ClusterEditor from "./cluster-config/editor";
import NamespacesEditor from "./namespaces-function/editor";

declare const RED: EditorRED;

// fetch discovered types from the backend,
// and for each type, register a kube node (i.e. deployment, nodes, pods, etc. etc. including CRDs)
// in node-red

// for type := range discoveredTypes {
//     RED.nodes.registerType("pods", PodsEditor);
// }

RED.nodes.registerType("lower-case", LowerCaseEditor);
RED.nodes.registerType("cluster-config", ClusterEditor);
RED.nodes.registerType("namespaces", NamespacesEditor);
