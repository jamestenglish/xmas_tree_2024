// import { useEffect } from "react";
// import { v7 } from "uuid";
// import { useShallow } from "zustand/shallow";
// import findAllTimelineObjectsByGroupId from "~/features/tree-editor/state/functions/findAllTimelineObjectsByGroupId";
// import useEditorStore from "~/features/tree-editor/state/useEditorStore";

// // here be dragons
// // this is ugly and I hate it
// export default function useOnClickPlayStateMachine() {
//   //

//   const {
//     timelineModel,
//     canvasCylinderImgUrls,
//     timelineSelectedGroupId,
//     setTimelineSelectedGroupId,

//     setTimelineActionId,
//     timelineActionId,
//     setTimelineExportState,
//     timelineExportState,
//   } = useEditorStore(
//     useShallow((state) => ({
//       timelineModel: state.timelineModel,
//       canvasCylinderImgUrls: state.canvasCylinderImgUrls,
//       setTimelineSelectedGroupId: state.setTimelineSelectedGroupId,
//       timelineSelectedGroupId: state.timelineSelectedGroupId,

//       setTimelineExportState: state.setTimelineExportState,
//       timelineExportState: state.timelineExportState,
//       timelineActionId: state.timelineActionId,
//       setTimelineActionId: state.setTimelineActionId,
//     })),
//   );

//   useEffect(() => {
//     const {
//       status,
//       groupIds,
//       groupId,
//       prevAttributes,
//       allTimelineObjectsByGroupId,
//       initGroupIds,
//       prevGroupId,
//     } = timelineExportState;
//     const newPrevAttributes = `${timelineActionId}|${canvasCylinderImgUrl}`;

//     if (status !== "IDLE") {
//       console.log("----------------\n\n\n----------------");
//       console.log(`timelineExportState status: ${status}`);
//       console.log({ timelineExportState });
//       console.log(JSON.stringify({ status, initGroupIds }, null, 2));
//       console.log("timelineSelectedGroupId: ", timelineSelectedGroupId);
//     }

//     const error = (errorMessage: string) => {
//       setTimelineExportState({
//         ...timelineExportState,
//         status: "ERROR",
//         groupIds: [] as string[],
//         errorMessage,
//       });
//     };

//     const doHateMyself = true;

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const hateMyself = (func: any) => {
//       if (doHateMyself) {
//         setTimeout(() => func(), 250);
//         setTimelineExportState({
//           ...timelineExportState,
//           status: "PAUSE",
//         });
//       } else {
//         func();
//       }
//     };

//     switch (status) {
//       case "IDLE":
//         return;
//       case "START": {
//         const allTimelineObjectsByGroupId = findAllTimelineObjectsByGroupId({
//           timelineModel,
//         });
//         console.log({ allTimelineObjectsByGroupId });
//         const groupIds = Object.keys(allTimelineObjectsByGroupId);
//         console.log(groupIds);

//         setTimelineSelectedGroupId(null);
//         setTimelineExportState({
//           status: "INIT_STATE",
//           groupIds: groupIds,
//           allTimelineObjectsByGroupId,
//           initGroupIds: groupIds,
//         });

//         return;
//       }
//       case "INIT_STATE": {
//         console.log("initGroupIds?.length: ", initGroupIds?.length);
//         if (timelineSelectedGroupId === null) {
//           const [prevGroupId, ...restGroupIds] = initGroupIds ?? [];
//           setTimelineSelectedGroupId(prevGroupId);
//           setTimelineExportState({
//             ...timelineExportState,
//             status: "INIT_STATE_A",
//             initGroupIds: restGroupIds,
//             prevGroupId: prevGroupId,
//           });
//         }
//         return;
//       }
//       case "INIT_STATE_A": {
//         console.log("initGroupIds?.length: ", initGroupIds?.length);
//         if (prevGroupId && prevGroupId === timelineSelectedGroupId) {
//           if (initGroupIds?.length === 0) {
//             hateMyself(() => {
//               setTimelineExportState({
//                 ...timelineExportState,
//                 status: "GROUP_EXPORT_INIT",
//               });
//             });
//           } else {
//             const [prevGroupId, ...restGroupIds] = initGroupIds ?? [];
//             setTimelineSelectedGroupId(prevGroupId);
//             hateMyself(() => {
//               setTimelineExportState({
//                 ...timelineExportState,
//                 status: "INIT_STATE_A",
//                 initGroupIds: restGroupIds,
//                 prevGroupId: prevGroupId,
//               });
//             });
//           }
//         }
//         return;
//       }
//       case "GROUP_EXPORT_INIT": {
//         setTimelineSelectedGroupId(null);
//         hateMyself(() => {
//           setTimelineExportState({
//             ...timelineExportState,
//             status: "GROUP_EXPORT_START",
//           });
//         });

//         return;
//       }

//       case "GROUP_EXPORT_START": {
//         if (timelineSelectedGroupId === null) {
//           if (groupIds?.length === 0) {
//             hateMyself(() => {
//               setTimelineExportState({
//                 ...timelineExportState,
//                 status: "PLAY",
//                 groupIds: [] as string[],
//               });
//             });
//             return;
//           }

//           const [groupId, ...newGroupIds] = groupIds;

//           setTimelineSelectedGroupId(groupId);
//           hateMyself(() => {
//             setTimelineExportState({
//               ...timelineExportState,
//               status: "GROUP_EXPORT_LOAD_CANVAS_START",
//               groupIds: newGroupIds,
//               groupId,
//             });
//           });
//         }
//         return;
//       }

//       case "GROUP_EXPORT_LOAD_CANVAS_START": {
//         if (timelineSelectedGroupId !== null) {
//           if (!groupId) {
//             error("Error not groupId in GROUP_EXPORT_LOAD_CANVAS_START");
//             return;
//           }
//           hateMyself(() => {
//             setTimelineExportState({
//               ...timelineExportState,
//               status: "GROUP_EXPORT_LOAD_CANVAS_EXPORT",
//               groupIds,
//               groupId,
//               prevAttributes: newPrevAttributes,
//             });
//           });
//         }
//         return;
//       }
//       case "GROUP_EXPORT_LOAD_CANVAS_EXPORT": {
//         if (timelineSelectedGroupId !== null) {
//           setTimelineActionId(v7());
//           hateMyself(() => {
//             setTimelineExportState({
//               ...timelineExportState,
//               status: "GROUP_EXPORT_LOAD_CANVAS_WAIT",
//             });
//           });
//         }

//         return;
//       }
//       case "GROUP_EXPORT_LOAD_CANVAS_WAIT": {
//         hateMyself(() => {
//           setTimelineExportState({
//             ...timelineExportState,
//             status: "GROUP_EXPORT_LOAD_CANVAS_FINISH",
//           });
//         });
//         return;
//       }
//       case "GROUP_EXPORT_LOAD_CANVAS_FINISH": {
//         if (
//           prevAttributes !== undefined &&
//           newPrevAttributes !== prevAttributes
//         ) {
//           if (!groupId) {
//             error("Error not groupId in GROUP_EXPORT_LOAD_CANVAS_WAIT");
//             return;
//           }
//           if (!allTimelineObjectsByGroupId) {
//             error(
//               "Error not allTimelineObjectsByGroupId in GROUP_EXPORT_LOAD_CANVAS_WAIT",
//             );
//             return;
//           }

//           const timelineObjects = allTimelineObjectsByGroupId[groupId];
//           if (!timelineObjects) {
//             error("Error not timelineObjects in GROUP_EXPORT_LOAD_CANVAS_WAIT");
//             return;
//           }

//           // so ugly, we should now have a canvasCylinderImgUrl
//           const prevUrls = timelineExportState.canvasCylinderImgUrlsData ?? [];
//           const start = Math.min(
//             timelineObjects.keyframes[0].val,
//             timelineObjects.keyframes[1].val,
//           );
//           const end = Math.max(
//             timelineObjects.keyframes[0].val,
//             timelineObjects.keyframes[1].val,
//           );
//           const newUrls = [
//             ...prevUrls,
//             { groupId, canvasCylinderImgUrl, start, end },
//           ];
//           hateMyself(() => {
//             setTimelineExportState({
//               ...timelineExportState,
//               status: "GROUP_EXPORT_INIT",
//               groupIds,
//               groupId: null,
//               prevAttributes: newPrevAttributes,
//               canvasCylinderImgUrlsData: newUrls,
//               prevGroupId: null,
//               initGroupIds: null,
//             });
//           });
//         }

//         return;
//       }

//       case "ERROR": {
//         console.error(timelineExportState.errorMessage);
//         console.error({ timelineExportState });
//         setTimelineExportState({
//           status: "IDLE",
//           groupIds: [] as string[],
//           groupId: null,
//           errorMessage: null,
//           prevAttributes: null,
//           canvasCylinderImgUrlsData: null,
//           allTimelineObjectsByGroupId: null,
//           initGroupIds: null,
//         });

//         return;
//       }
//     }
//   }, [
//     canvasCylinderImgUrl,
//     setTimelineActionId,
//     setTimelineExportState,
//     setTimelineSelectedGroupId,
//     timelineActionId,
//     timelineExportState,
//     timelineModel,
//     timelineSelectedGroupId,
//   ]);
// }