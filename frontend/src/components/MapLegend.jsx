const legendItems = [
  { color: 'bg-yellow-800', label: 'Dormancia' },
  { color: 'bg-yellow-400', label: 'Pico Floración' },
  { color: 'bg-green-500', label: 'Pico Corazón' },
];

const MapLegend = () => {
  return (
    <div className="bg-[#1E2024] flex justify-center items-center space-x-6 mt-4 py-6 rounded-lg">
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center space-x-2">
          <div className={`w-4 h-4 rounded ${item.color}`}></div>
          <span className="text-sm text-gray-300">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default MapLegend;