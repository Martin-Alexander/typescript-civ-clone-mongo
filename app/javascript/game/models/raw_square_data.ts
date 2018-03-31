import RawUnitData from "./raw_unit_data"
import RawStructureData from "./raw_structure_data";

export default interface RawSquareData {
  _id: { $oid: string };
  structures: RawStructureData[];
  terrain: string;
  type: string;
  units: RawUnitData[];
  x: number;
  y: number;
}
