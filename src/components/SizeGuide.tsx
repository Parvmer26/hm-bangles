import { useState } from 'react';
import { X, Ruler } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const sizeData = [
  { size: '2.2', cm: '5.5 cm', inches: '2.2"', fits: 'Very slim wrist' },
  { size: '2.4', cm: '6.0 cm', inches: '2.4"', fits: 'Slim wrist' },
  { size: '2.6', cm: '6.5 cm', inches: '2.6"', fits: 'Average wrist' },
  { size: '2.8', cm: '7.0 cm', inches: '2.8"', fits: 'Slightly wide wrist' },
  { size: '2.10', cm: '7.5 cm', inches: '2.10"', fits: 'Wide wrist' },
  { size: '2.12', cm: '8.0 cm', inches: '2.12"', fits: 'Very wide wrist' },
];

export default function SizeGuide() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
      >
        <Ruler size={12} /> Size guide
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative bg-background border border-border p-6 max-w-md w-full z-10"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-xl font-medium">Size Guide</h3>
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Measure the widest part of your hand (across the knuckles) with a measuring tape.
              </p>

              <div className="border border-border overflow-hidden mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/40">
                      <th className="text-left px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground font-medium">Size</th>
                      <th className="text-left px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground font-medium">Knuckle width</th>
                      <th className="text-left px-3 py-2 text-xs uppercase tracking-wide text-muted-foreground font-medium">Fits</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeData.map((row, i) => (
                      <tr key={row.size} className={`border-t border-border ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                        <td className="px-3 py-2 font-medium">{row.size}</td>
                        <td className="px-3 py-2 text-muted-foreground">{row.cm}</td>
                        <td className="px-3 py-2 text-muted-foreground text-xs">{row.fits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs text-amber-700">
                <strong>Tip:</strong> If you are between sizes, we recommend going one size up for a comfortable fit.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}