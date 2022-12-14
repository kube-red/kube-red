import { EditorNodeDef, EditorNodeProperties } from 'node-red';
import { Controller, ClusterConfig } from "./types";

export interface ClusterConfigEditorProperties extends EditorNodeProperties {
    nodename: string;
    config: ClusterConfig;
}

const ClusterConfigEditor: EditorNodeDef<ClusterConfigEditorProperties> = {
    category: 'config',
    color: '#a6bbcf',
    defaults: {
        nodename: {value:""},
        config: {value: Controller.defaults},
    },
    inputs:0,
    outputs:0,
    icon: "file.png",
    oneditsave: oneditsave,
    oneditprepare: oneditprepare,
    label: function() {
        return this.nodename||Controller.name;
    }
}

export default ClusterConfigEditor;

function oneditsave() {
    this.config = Controller.defaults;

    this.nodename = $("#node-input-nodename").val()
    this.config.server = $("#node-input-server").val();
    this.config.incluster = $("#node-input-incluster").is(":checked");
    this.config.user = $("#node-input-user").val();
    this.config.password = $("#node-input-password").val();
}

function oneditprepare() {
    // Add hooks to disable form fields when incluster is checked
    const container = $("#node-input-incluster");
    container.on('change', function() {
        $("#node-input-server").prop("disabled", container.is(":checked"));
        $("#node-input-user").prop("disabled", container.is(":checked"));
        $("#node-input-password").prop("disabled", container.is(":checked"));
    });

    // restore form values
    $("#node-input-nodename").val(this.nodename)
    $("#node-input-incluster").prop("checked", this.config.incluster);
    $("#node-input-server").val(this.config.server);
    $("#node-input-user").val(this.config.user);
    $("#node-input-password").val(this.config.password);

    // On restore disable if needed
    $("#node-input-server").prop("disabled", this.config.incluster);
    $("#node-input-user").prop("disabled", this.config.incluster);
    $("#node-input-password").prop("disabled", this.config.incluster);
}
