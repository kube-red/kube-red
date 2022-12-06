(function () {
    'use strict';

    const LowerCaseEditor = {
        category: 'function',
        color: '#a6bbcf',
        defaults: {
            name: { value: "" },
            prefix: { value: "" }
        },
        inputs: 1,
        outputs: 1,
        icon: "file.png",
        label: function () {
            return this.name || "lower-case";
        }
    };

    // fetch discovered types from the backend,
    // and for each type, register a kube node (i.e. deployment, nodes, pods, etc. etc. including CRDs)
    // in node-red
    // for type := range discoveredTypes {
    //     RED.nodes.registerType("pods", PodsEditor);
    // }
    RED.nodes.registerType("lower-case", LowerCaseEditor);

})();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmpzIiwic291cmNlcyI6WyJzcmMvbG93ZXItY2FzZS9lZGl0b3IudHMiLCJzcmMvZWRpdG9yLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVkaXRvck5vZGVEZWYsIEVkaXRvck5vZGVQcm9wZXJ0aWVzIH0gZnJvbSAnbm9kZS1yZWQnO1xuXG5leHBvcnQgaW50ZXJmYWNlIExvd2VyQ2FzZUVkaXRvclByb3BlcnRpZXMgZXh0ZW5kcyBFZGl0b3JOb2RlUHJvcGVydGllcyB7XG4gICAgcHJlZml4OiBzdHJpbmc7XG59XG5cbmNvbnN0IExvd2VyQ2FzZUVkaXRvcjogRWRpdG9yTm9kZURlZjxMb3dlckNhc2VFZGl0b3JQcm9wZXJ0aWVzPiA9IHtcbiAgICBjYXRlZ29yeTogJ2Z1bmN0aW9uJyxcbiAgICBjb2xvcjogJyNhNmJiY2YnLFxuICAgIGRlZmF1bHRzOiB7XG4gICAgICAgIG5hbWU6IHt2YWx1ZTpcIlwifSxcbiAgICAgICAgcHJlZml4OiB7dmFsdWU6IFwiXCJ9XG4gICAgfSxcbiAgICBpbnB1dHM6MSxcbiAgICBvdXRwdXRzOjEsXG4gICAgaWNvbjogXCJmaWxlLnBuZ1wiLFxuICAgIGxhYmVsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubmFtZXx8XCJsb3dlci1jYXNlXCI7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb3dlckNhc2VFZGl0b3I7XG4iLCJpbXBvcnQgeyBFZGl0b3JSRUQgfSBmcm9tIFwibm9kZS1yZWRcIjtcbmltcG9ydCBMb3dlckNhc2VFZGl0b3IgZnJvbSBcIi4vbG93ZXItY2FzZS9lZGl0b3JcIjtcblxuZGVjbGFyZSBjb25zdCBSRUQ6IEVkaXRvclJFRDtcblxuLy8gZmV0Y2ggZGlzY292ZXJlZCB0eXBlcyBmcm9tIHRoZSBiYWNrZW5kLFxuLy8gYW5kIGZvciBlYWNoIHR5cGUsIHJlZ2lzdGVyIGEga3ViZSBub2RlIChpLmUuIGRlcGxveW1lbnQsIG5vZGVzLCBwb2RzLCBldGMuIGV0Yy4gaW5jbHVkaW5nIENSRHMpXG4vLyBpbiBub2RlLXJlZFxuXG4vLyBmb3IgdHlwZSA6PSByYW5nZSBkaXNjb3ZlcmVkVHlwZXMge1xuLy8gICAgIFJFRC5ub2Rlcy5yZWdpc3RlclR5cGUoXCJwb2RzXCIsIFBvZHNFZGl0b3IpO1xuLy8gfVxuXG5SRUQubm9kZXMucmVnaXN0ZXJUeXBlKFwibG93ZXItY2FzZVwiLCBMb3dlckNhc2VFZGl0b3IpO1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQU1BLE1BQU0sZUFBZSxHQUE2QztJQUM5RCxJQUFBLFFBQVEsRUFBRSxVQUFVO0lBQ3BCLElBQUEsS0FBSyxFQUFFLFNBQVM7SUFDaEIsSUFBQSxRQUFRLEVBQUU7SUFDTixRQUFBLElBQUksRUFBRSxFQUFDLEtBQUssRUFBQyxFQUFFLEVBQUM7SUFDaEIsUUFBQSxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsRUFBRSxFQUFDO0lBQ3RCLEtBQUE7SUFDRCxJQUFBLE1BQU0sRUFBQyxDQUFDO0lBQ1IsSUFBQSxPQUFPLEVBQUMsQ0FBQztJQUNULElBQUEsSUFBSSxFQUFFLFVBQVU7SUFDaEIsSUFBQSxLQUFLLEVBQUUsWUFBQTtJQUNILFFBQUEsT0FBTyxJQUFJLENBQUMsSUFBSSxJQUFFLFlBQVksQ0FBQztTQUNsQztLQUNKOztJQ2REO0lBQ0E7SUFDQTtJQUVBO0lBQ0E7SUFDQTtJQUVBLEdBQUcsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxlQUFlLENBQUM7Ozs7OzsifQ==