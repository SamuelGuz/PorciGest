export default function Grafico({ title }: { title: string }) {
  return (
    <article className="h-40 shadow-lg mt-3 py-5 px-4 rounded-sm w-full">
      <div id="header" className="flex justify-between items-center">
        <h5 className="font-bold">{title}</h5>
      </div>
      <div id="graphic"></div>
    </article>
  );
}
