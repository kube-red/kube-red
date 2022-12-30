import * as nodered from "node-red";
import * as k8s from '@kubernetes/client-node';

interface PayloadType extends nodered.NodeMessageInFlow {
    namespace: string;
    object: k8s.KubernetesObject;
}

export default PayloadType;
