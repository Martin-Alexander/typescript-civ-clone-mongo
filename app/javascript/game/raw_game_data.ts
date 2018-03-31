import RawSquareData from "./models/raw_square_data";

export default interface RawGameData {
  _id: { $oid: string };
  players: any[];
  size: number;
  squares: RawSquareData[];
  state: string;
  turn: number;
}
