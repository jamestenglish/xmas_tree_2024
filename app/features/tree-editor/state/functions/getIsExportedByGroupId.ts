import { ByGroupType } from "../useEditorStore";

const getIsExported = ({
  canvasLastEditTimestamp,
  canvasLastExportTimestamp,
}: {
  canvasLastEditTimestamp: number;
  canvasLastExportTimestamp: number;
}) => {
  const result = canvasLastEditTimestamp <= canvasLastExportTimestamp;

  return result;
};

interface ExportedByGroupIdType {
  [key: string]: boolean;
}
const getIsExportedByGroupId = ({
  attributesByGroup,
}: {
  attributesByGroup: ByGroupType;
}) => {
  const groupIds = Object.keys(attributesByGroup);

  const unexportedByGroupId = groupIds.reduce((acc, groupId) => {
    const attributes = attributesByGroup[groupId];
    if (attributes) {
      const { canvasLastEditTimestamp, canvasLastExportTimestamp } = attributes;

      const isExported = getIsExported({
        canvasLastEditTimestamp,
        canvasLastExportTimestamp,
      });

      console.log({
        canvasLastEditTimestamp,
        canvasLastExportTimestamp,
        groupId,
        isExported,
      });

      acc[groupId] = isExported;
    }
    return acc;
  }, {} as ExportedByGroupIdType);

  return unexportedByGroupId;
};

export default getIsExportedByGroupId;
