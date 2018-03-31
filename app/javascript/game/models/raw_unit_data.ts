export default interface RawUnitData {
  go_to: [[number, number]]
  _id: {$oid: string}
  moves: number
  order: string
  player_number: number
  state: string
  strength: number
  type: string
}
