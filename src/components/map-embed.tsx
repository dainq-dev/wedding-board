import { mapEmbedSrc, type Venue } from "@/try-it/parse-maps-url";

export function MapEmbed({
  venue,
  className,
}: {
  venue: Venue;
  className?: string;
}) {
  return (
    <iframe
      title={venue.name ?? "Bản đồ địa điểm"}
      src={mapEmbedSrc(venue)}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}
