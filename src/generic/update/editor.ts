import { EditorNodeDef, EditorNodeProperties } from 'node-red';
import { Controller } from './types';
import { Controller as ClusterConfigController} from '../../cluster-config/types';

export interface UpdateEditorProperties extends EditorNodeProperties {
    nodename: string;
    cluster: string;
}


const UpdateEditor: EditorNodeDef<UpdateEditorProperties> = {
    category: 'kubernetes',
    color: "#326DE6",
    icon: "kubernetes_logo_40x60_white.png",
    align: "left",
    defaults: {
        nodename: {value:""},
        cluster: {value: "", type: ClusterConfigController.name, required: true},
    },
    inputs:1,
    outputs:1,
    label: function() {
        return this.nodename||Controller.name;
    },
}

export default UpdateEditor;
