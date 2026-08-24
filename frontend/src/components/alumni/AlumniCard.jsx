import { UserRound } from "lucide-react";

export default function AlumniCard({ alumni }) {
  return (
    <div className="glass-card glow-border rounded-lg p-5 text-center">
      <div className="flex justify-center mb-4">
        <div
          className="w-22 h-22 rounded-full flex items-center justify-center
                     bg-gold/10 border border-gold/30
                     shadow-[0_0_20px_rgba(212,175,55,0.35)]"
        >
          <UserRound
            size={32}
            className="text-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]"
          />
        </div>
      </div>

      <h4 className="text-text-primary font-semibold">
        {alumni.student?.name}
      </h4>

      {alumni.currentRole && (
        <p className="text-gold text-sm mt-1">
          {alumni.currentRole}
        </p>
      )}

      {alumni.testimonial && (
        <p className="text-text-secondary text-sm mt-3 italic leading-relaxed">
          "{alumni.testimonial}"
        </p>
      )}
    </div>
  );
}