import { SCREEN_WIDTH, SCREEN_HEIGHT } from "~/constants";

export default function WindowConstraint({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        style={{
          height: `${SCREEN_HEIGHT}px`,
          width: `${SCREEN_WIDTH}px`,
          maxHeight: `${SCREEN_HEIGHT}px`,
          maxWidth: `${SCREEN_WIDTH}px`,
        }}
        className="overflow-hidden"
      >
        {children}
      </div>
    </>
  );
}
