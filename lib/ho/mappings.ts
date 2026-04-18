export interface HoSmallBoatConfig {
  /** "monthly" — most recent complete calendar month total
   *  "ytd"     — cumulative total for the current calendar year */
  type: "monthly" | "ytd";
}

/**
 * Maps stat slugs to their Home Office small boats configuration.
 * A single shared ODS fetch provides data for both stats.
 */
export const HO_SMALL_BOATS_MAP: Record<string, HoSmallBoatConfig> = {
  "small-boat-arrivals-monthly": { type: "monthly" },
  "small-boat-arrivals-ytd": { type: "ytd" },
};
