import { useEffect } from "react";
import { v7 } from "uuid";
import { useShallow } from "zustand/shallow";
import findAllTimelineObjectsByGroupId from "~/features/tree-editor/state/functions/findAllTimelineObjectsByGroupId";
import useEditorStore from "~/features/tree-editor/state/useEditorStore";

// here be dragons
// this is ugly and I hate it
export default function useOnClickPlayStateMachine() {
  const {
    timelineExportState,
    timelineModel,
    timelineActionId,
    canvasCylinderImgUrl,
    timelineSelectedGroupId,
    setTimelineExportState,
    setTimelineSelectedGroupId,
    setTimelineActionId,
  } = useEditorStore(
    useShallow((state) => ({
      timelineExportState: state.timelineExportState,
      timelineModel: state.timelineModel,
      setTimelineExportState: state.setTimelineExportState,
      timelineActionId: state.timelineActionId,
      canvasCylinderImgUrl: state.canvasCylinderImgUrl,
      setTimelineSelectedGroupId: state.setTimelineSelectedGroupId,
      setTimelineActionId: state.setTimelineActionId,
      timelineSelectedGroupId: state.timelineSelectedGroupId,
    })),
  );

  useEffect(() => {
    const {
      status,
      groupIds,
      groupId,
      prevAttributes,
      allTimelineObjectsByGroupId,
      initGroupIds,
      prevGroupId,
    } = timelineExportState;
    const newPrevAttributes = `${timelineActionId}|${canvasCylinderImgUrl}`;

    if (status !== "IDLE") {
      console.log("----------------\n\n\n----------------");
      console.log(`timelineExportState status: ${status}`);
      console.log({ timelineExportState });
      console.log(JSON.stringify({ status, initGroupIds }, null, 2));
      console.log("timelineSelectedGroupId: ", timelineSelectedGroupId);
    }

    const error = (errorMessage: string) => {
      setTimelineExportState({
        ...timelineExportState,
        status: "ERROR",
        groupIds: [] as string[],
        errorMessage,
      });
    };

    switch (status) {
      case "IDLE":
        return;
      case "START": {
        const allTimelineObjectsByGroupId = findAllTimelineObjectsByGroupId({
          timelineModel,
        });
        console.log({ allTimelineObjectsByGroupId });
        const groupIds = Object.keys(allTimelineObjectsByGroupId);
        console.log(groupIds);

        setTimelineSelectedGroupId(null);
        setTimelineExportState({
          status: "INIT_STATE",
          groupIds: groupIds,
          allTimelineObjectsByGroupId,
          initGroupIds: groupIds,
        });

        return;
      }
      case "INIT_STATE": {
        console.log("initGroupIds?.length: ", initGroupIds?.length);
        if (timelineSelectedGroupId === null) {
          const [prevGroupId, ...restGroupIds] = initGroupIds ?? [];
          setTimelineSelectedGroupId(prevGroupId);
          setTimelineExportState({
            ...timelineExportState,
            status: "INIT_STATE_A",
            initGroupIds: restGroupIds,
            prevGroupId: prevGroupId,
          });
        }
        return;
      }
      case "INIT_STATE_A": {
        console.log("initGroupIds?.length: ", initGroupIds?.length);
        if (prevGroupId && prevGroupId === timelineSelectedGroupId) {
          if (initGroupIds?.length === 0) {
            setTimelineExportState({
              ...timelineExportState,
              status: "GROUP_EXPORT_INIT",
            });
          } else {
            const [prevGroupId, ...restGroupIds] = initGroupIds ?? [];
            setTimelineSelectedGroupId(prevGroupId);
            setTimelineExportState({
              ...timelineExportState,
              status: "INIT_STATE_A",
              initGroupIds: restGroupIds,
              prevGroupId: prevGroupId,
            });
          }
        }
        return;
      }
      case "GROUP_EXPORT_INIT": {
        setTimelineSelectedGroupId(null);

        setTimelineExportState({
          ...timelineExportState,
          status: "GROUP_EXPORT_START",
        });

        return;
      }

      case "GROUP_EXPORT_START": {
        if (timelineSelectedGroupId === null) {
          if (groupIds?.length === 0) {
            setTimelineExportState({
              ...timelineExportState,
              status: "PLAY",
              groupIds: [] as string[],
            });
            return;
          }

          const [groupId, ...newGroupIds] = groupIds;

          setTimelineSelectedGroupId(groupId);

          setTimelineExportState({
            ...timelineExportState,
            status: "GROUP_EXPORT_LOAD_CANVAS_START",
            groupIds: newGroupIds,
            groupId,
          });
        }
        return;
      }

      case "GROUP_EXPORT_LOAD_CANVAS_START": {
        if (timelineSelectedGroupId !== null) {
          if (!groupId) {
            error("Error not groupId in GROUP_EXPORT_LOAD_CANVAS_START");
            return;
          }

          setTimelineExportState({
            ...timelineExportState,
            status: "GROUP_EXPORT_LOAD_CANVAS_EXPORT",
            groupIds,
            groupId,
            prevAttributes: newPrevAttributes,
          });
        }
        return;
      }
      case "GROUP_EXPORT_LOAD_CANVAS_EXPORT": {
        if (timelineSelectedGroupId !== null) {
          setTimelineActionId(v7());

          setTimelineExportState({
            ...timelineExportState,
            status: "GROUP_EXPORT_LOAD_CANVAS_WAIT",
          });
        }

        return;
      }
      case "GROUP_EXPORT_LOAD_CANVAS_WAIT": {
        setTimelineExportState({
          ...timelineExportState,
          status: "GROUP_EXPORT_LOAD_CANVAS_FINISH",
        });
        return;
      }
      case "GROUP_EXPORT_LOAD_CANVAS_FINISH": {
        if (
          prevAttributes !== undefined &&
          newPrevAttributes !== prevAttributes
        ) {
          if (!groupId) {
            error("Error not groupId in GROUP_EXPORT_LOAD_CANVAS_WAIT");
            return;
          }
          if (!allTimelineObjectsByGroupId) {
            error(
              "Error not allTimelineObjectsByGroupId in GROUP_EXPORT_LOAD_CANVAS_WAIT",
            );
            return;
          }

          const timelineObjects = allTimelineObjectsByGroupId[groupId];
          if (!timelineObjects) {
            error("Error not timelineObjects in GROUP_EXPORT_LOAD_CANVAS_WAIT");
            return;
          }

          // so ugly, we should now have a canvasCylinderImgUrl
          const prevUrls = timelineExportState.canvasCylinderImgUrlsData ?? [];
          const start = Math.min(
            timelineObjects.keyframes[0].val,
            timelineObjects.keyframes[1].val,
          );
          const end = Math.max(
            timelineObjects.keyframes[0].val,
            timelineObjects.keyframes[1].val,
          );
          const newUrls = [
            ...prevUrls,
            { groupId, canvasCylinderImgUrl, start, end },
          ];

          setTimelineExportState({
            ...timelineExportState,
            status: "GROUP_EXPORT_INIT",
            groupIds,
            groupId: null,
            prevAttributes: newPrevAttributes,
            canvasCylinderImgUrlsData: newUrls,
            prevGroupId: null,
            initGroupIds: null,
          });
        }

        return;
      }

      case "ERROR": {
        console.error(timelineExportState.errorMessage);
        console.error({ timelineExportState });
        setTimelineExportState({
          status: "IDLE",
          groupIds: [] as string[],
          groupId: null,
          errorMessage: null,
          prevAttributes: null,
          canvasCylinderImgUrlsData: null,
          allTimelineObjectsByGroupId: null,
          initGroupIds: null,
        });

        return;
      }
    }
  }, [
    canvasCylinderImgUrl,
    setTimelineActionId,
    setTimelineExportState,
    setTimelineSelectedGroupId,
    timelineActionId,
    timelineExportState,
    timelineModel,
    timelineSelectedGroupId,
  ]);
}
