import { EditorNodeDef, EditorNodeProperties } from 'node-red';
import { Controller } from './types';
import { Controller as ClusterConfigController} from '../../cluster-config/types';

export interface DeleteEditorProperties extends EditorNodeProperties {
    nodename: string;
    cluster: string;
    apiversion: string;
    kind: string;
    namespace: string;
    name: string;
}


const DeleteEditor: EditorNodeDef< DeleteEditorProperties> = {
    category: 'kubernetes',
    color: "#326DE6",
    icon: "kubernetes_logo_40x60_white.png",
    align: "left",
    defaults: {
        nodename: {value:""},
        cluster: {value: "", type: ClusterConfigController.name, required: true},
        apiversion: { value: "" },
        kind: { value: "" },
        namespace: { value: "" },
        name: { value: "" },
    },
    inputs:1,
    outputs:1,
    label: function() {
        return this.nodename||Controller.name;
    },
}

export default DeleteEditor;
