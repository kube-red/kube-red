import { EditorNodeDef, EditorNodeProperties, EditorRED } from 'node-red';
import { Controller } from './types';
import { Controller as ClusterConfigController} from '../../cluster-config/types';

declare const RED: EditorRED;

export interface NamespaceEditorProperties extends EditorNodeProperties {
    nodename: string;
    cluster: string;
    name: string;
    template: string;
}

let templateEditor: AceAjax.Editor | undefined;

const NamespaceEditor: EditorNodeDef<NamespaceEditorProperties> = {
    category: 'kubernetes',
    color: "#5f8dec",
    icon: "kubernetes_logo_40x60_white.png",
    align: "left",
    defaults: {
        nodename: {value:""},
        cluster: {value: "", type: ClusterConfigController.name, required: true},
        name: { value: "" },
        template: { value: '' },
    },
    inputs:1,
    outputs:1,
    label: function() {
        return this.nodename||Controller.name;
    },
    oneditprepare: function() {
        const $inputTemplate = $('#node-input-template');

        templateEditor = RED.editor.createEditor({
            id: 'node-input-template-editor',
            mode: 'ace/mode/text',
            value: $inputTemplate.val() as string,
        });
    },
    oneditresize: function() {
        const $rows = $('#dialog-form>div:not(.node-text-editor-row)');
        const $editorRow = $('#dialog-form>div.node-text-editor-row');
        const $textEditor = $('.node-text-editor');
        const $dialogForm = $('#dialog-form');

        let height = $dialogForm.height() ?? 0;
        for (let i = 0; i < $rows.length; i++) {
           const outerHeight = $($rows[i]).outerHeight(true);
            if (typeof outerHeight === 'number') {
                height -= outerHeight;
            }
        }
        height -=
            parseInt($editorRow.css('marginTop')) +
            parseInt($editorRow.css('marginBottom'));

        $textEditor.css('height', `${height}px`);
        templateEditor?.resize();
    },
    oneditcancel: function () {
        templateEditor?.destroy();
        templateEditor = undefined;
    },
    oneditsave: function () {
        const newValue = templateEditor?.getValue() ?? '';
        $('#node-input-template').val(newValue);
        templateEditor?.destroy();
        templateEditor = undefined;
    },
}



export default NamespaceEditor;
