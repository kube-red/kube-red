import { EditorNodeDef, EditorNodeProperties } from 'node-red';
import { Controller } from './types';
import { Controller as ClusterConfigController} from '../cluster-config/types';

export interface UpsertEditorProperties extends EditorNodeProperties {
    cluster: string;
}


const UpsertEditor: EditorNodeDef<UpsertEditorProperties> = {
    category: 'kubernetes',
    color: "#326DE6",
    icon: "kubernetes_logo_40x60_white.png",
    align: "left",
    defaults: {
        name: {value:""},
        cluster: {value: "", type: ClusterConfigController.name, required: true},
    },
    inputs:1,
    outputs:1,
    label: function() {
        return this.name||Controller.name;
    },
}

export default UpsertEditor;
