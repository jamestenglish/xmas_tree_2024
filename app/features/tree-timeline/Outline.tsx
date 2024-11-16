import { useCallback } from "react";
import { Timeline } from "animation-timeline-js";

import { setAutoFreeze } from "immer";
import useEditorStore from "../tree-editor/hooks/useEditorStore";
import { useShallow } from "zustand/react/shallow";

setAutoFreeze(false);

type OutlineNodeProps = {
  timeline: Timeline | undefined;
  index: number;
};

function OutlineNode({ timeline, index }: OutlineNodeProps) {
  const { addGroupToRow, deleteRow, rows } = useEditorStore(
    useShallow((state) => ({
      addGroupToRow: state.addGroupToRow,
      deleteRow: state.deleteRow,
      rows: state.model.rows,
    })),
  );

  const row = rows[index];

  const onAddTrackGroup = useCallback(() => {
    if (!timeline) {
      return;
    }

    if (row.id) {
      addGroupToRow(timeline, row.id);
    }
  }, [addGroupToRow, row.id, timeline]);

  const onDeleteRow = useCallback(
    (indexToDelete: number) => {
      if (!timeline) {
        return;
      }
      deleteRow(indexToDelete);
    },
    [deleteRow, timeline],
  );

  if (!timeline) {
    return null;
  }

  const options = timeline.getOptions();
  const h =
    (row.style ? row.style.height : 0) ||
    (options.rowsStyle ? options.rowsStyle.height : 0);

  const marginBottom =
    ((options.rowsStyle ? options.rowsStyle.marginBottom : 0) || 0) + "px";

  const isLastRow = rows.length - 1 === index;
  const isDeletable = !isLastRow && rows.length > 2;
  return (
    <div
      style={{ maxHeight: `${h}px`, minHeight: `${h}px`, marginBottom }}
      className="outline-node flex flex-row"
    >
      {isDeletable ? (
        <button
          className="button mat-icon material-icons mat-icon-no-color"
          title="Add a keyframe group"
          onClick={() => onDeleteRow(index)}
        >
          delete
        </button>
      ) : (
        <div className="button-spacer" />
      )}
      <span>{isLastRow ? <>Drawing</> : <>Track {index}</>}</span>
      <div className="grow"></div>

      <button
        className="button mat-icon material-icons mat-icon-no-color"
        title="Add a keyframe group"
        onClick={onAddTrackGroup}
      >
        add
      </button>
    </div>
  );
}

type OutlineProps = {
  timeline: Timeline | undefined;
};
export default function Outline({ timeline }: OutlineProps) {
  const rows = useEditorStore((state) => state.model.rows);
  return (
    <>
      {rows.map((row, index) => {
        return (
          <OutlineNode
            /*TODO JTE*/
            key={row?.id ?? index}
            timeline={timeline}
            index={index}
          />
        );
      })}
    </>
  );
}
