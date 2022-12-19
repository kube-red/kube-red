import { EditorNodeDef, EditorNodeProperties } from 'node-red';
import { Controller, ClusterConfig } from "./types";

export interface ClusterConfigEditorProperties extends EditorNodeProperties {
    config: ClusterConfig;
}

const ClusterConfigEditor: EditorNodeDef<ClusterConfigEditorProperties> = {
    category: 'config',
    color: '#a6bbcf',
    defaults: {
        name: {value:""},
        config: {value: Controller.defaults},
    },
    inputs:0,
    outputs:0,
    icon: "file.png",
    oneditsave: Save,
    oneditprepare: Restore,
    label: function() {
        return this.name||Controller.name;
    }
}

export default ClusterConfigEditor;

function Save() {
    this.config = Controller.defaults;

    this.name = $("#node-input-name").val()
    this.config.incluster = $("#node-input-incluster").is(":checked");
    this.config.server = $("#node-input-server").val();
    this.config.user = $("#node-input-user").val();
    this.config.password = $("#node-input-password").val();
}

function Restore() {
    $("#node-input-name").val(this.name)
    $("#node-input-incluster").prop("checked", this.config.incluster);
    $("#node-input-server").val(this.config.server);
    $("#node-input-user").val(this.config.user);
    $("#node-input-password").val(this.config.password);
}
