import { Edit2, Trash2 } from "lucide-react";

const workSamples = [
  {
    id: 1,
    title: "Luxury Penthouse Furniture Setup",
    description: "Full white-glove assembly for a 4-bedroom penthouse in the Marina District. Included mounting custom artwork and complex Italian shelving units.",
    tag: "Relocation Logistics",
    image: "/images/jomnus.png"
  }
];

export default function WorkHistory() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {workSamples.map((item) => (
        <div key={item.id} className="group border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
          {/* Image Container */}
          <div className="relative h-48 bg-slate-100">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover" 
            />
            {/* Hover Actions */}
            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 bg-white rounded-lg shadow-sm text-slate-600 hover:text-blue-600">
                <Edit2 className="w-4 h-4" />
              </button>
              <button className="p-2 bg-red-500 rounded-lg shadow-sm text-white hover:bg-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            <h4 className="font-bold text-slate-800 leading-tight">{item.title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
              {item.description}
            </p>
            <div className="pt-2">
              <span className="inline-block px-2 py-1 rounded bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wide">
                {item.tag}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}