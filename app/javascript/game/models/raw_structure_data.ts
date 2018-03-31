export default interface RawStructureData {
  _id: { $oid: string };
  complete: boolean;
  construction_level: number;
  player_number: number;
  type: string;
  size: number | null;
}