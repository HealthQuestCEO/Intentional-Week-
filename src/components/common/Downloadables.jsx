import { FileText, Download, ExternalLink } from 'lucide-react';

export function Downloadables() {
  const downloads = [
    {
      name: 'Intentional Week Printable',
      description: 'A printable PDF version of the weekly planner',
      file: '/downloads/intentional-week-printable.pdf',
      icon: FileText,
    },
  ];

  const handleDownload = (file, name) => {
    const link = document.createElement('a');
    link.href = file;
    link.download = name.replace(/\s+/g, '-').toLowerCase() + '.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
        <Download className="w-5 h-5 text-balanced-teal" />
        Downloadables
      </h3>
      <div className="space-y-3">
        {downloads.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-balanced-teal/10 p-2 rounded-lg">
                <item.icon className="w-5 h-5 text-balanced-teal" />
              </div>
              <div>
                <p className="font-medium text-charcoal text-sm">{item.name}</p>
                <p className="text-xs text-charcoal/60">{item.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.open(item.file, '_blank')}
                className="p-2 text-charcoal/50 hover:text-balanced-teal transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDownload(item.file, item.name)}
                className="p-2 text-charcoal/50 hover:text-balanced-teal transition-colors"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Downloadables;
