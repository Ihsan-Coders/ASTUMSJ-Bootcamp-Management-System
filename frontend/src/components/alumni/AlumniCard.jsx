export default function AlumniCard({ alumni }) {
  return (
    <div className="glass-card glow-border rounded-lg p-4 text-center">
      {alumni.photoUrl && (
        <img
          src={alumni.photoUrl}
          alt={alumni.student?.name}
          className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
        />
      )}
      <h4 className="text-text-primary font-semibold">
        {alumni.student?.name}
      </h4>
      {alumni.currentRole && (
        <p className="text-gold text-sm mt-1">{alumni.currentRole}</p>
      )}
      {alumni.testimonial && (
        <p className="text-text-secondary text-sm mt-2 italic">
          "{alumni.testimonial}"
        </p>
      )}
    </div>
  );
}
