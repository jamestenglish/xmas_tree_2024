// TODO JTE smaller max-h and change animation params
export default function PreviousCaptureContainer({ src }: { src: string }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <img
        className="preview-img max-h-48 border-2 border-dkblue object-scale-down"
        src={src}
      />
    </div>
  );
}
