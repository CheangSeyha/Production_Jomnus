const categories = [
  { name: "Relocation", active: true },
  { name: "Tech Setup", active: true },
  { name: "Repair", active: false },
  { name: "Furniture", active: true },
  { name: "Electric", active: false },
];

export default function Specializations() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <h3 className="font-semibold text-lg">Specializations</h3>
        <p className="text-xs text-slate-400">Pick up to 5 primary categories</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map((cat) => (
          <button
            key={cat.name}
            className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
              cat.active 
              ? "bg-blue-600 text-white border-blue-600" 
              : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
            }`}
          >
            <span className="text-sm font-medium">{cat.name}</span>
          </button>
        ))}
        <button className="bg-slate-50 text-slate-400 p-4 rounded-lg border border-dashed border-slate-300 text-sm">
          Show All...
        </button>
      </div>
    </div>
  );
}