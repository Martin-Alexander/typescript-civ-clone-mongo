import RawSquareData from "./models/raw_square_data";
import RawGameData from "./raw_game_data";
import Square from "./models/square";

interface Coordinates {
  x: number;
  y: number;
}

export default class GameData {
  readonly id: string;
  readonly size: number;
  
  public players: any[];
  public UI: any;
  public squares: Square[];
  public state: string;

  public constructor(UI: any, rawGameDataString: string) {
    this.UI = UI;

    const rawGameData: RawGameData = JSON.parse(rawGameDataString);

    this.id = rawGameData._id.$oid;
    this.size = rawGameData.size;
    this.squares = rawGameData.squares.map(squareData => new Square(squareData));
    this.players = rawGameData.players;
    this.state = rawGameData.state;
  };

  // This should probably be deleted
  public initialize(): void {
    this.UI.ready = this.getCurrentPlayer().turn_over;
  };

  public getCurrentPlayer(): any {
    return this.players.find(player => player.current_player);
  };

  public square(col: any, row?: number): Square {
    let square: Square;

    if (row === undefined) {
      if (col.x && col.y) {
        square = this.squares[col.y * (this.size + 1) + col.x];
      } else {
        square = this.squares[col];
      }
    } else {
      square = this.squares[row * (this.size + 1) + col];
    }

    return square;
  };

  public findSquare(col: any, row?: number): Square {
    return this.square(col, row);
  };

  public replaceSquare(square: Square): void {
    this.squares[square.y * (this.size + 1) + square.x] = square;
  };

  public newGameData(rawGameData: RawGameData) {
    this.squares = rawGameData.squares.map(squareData => new Square(squareData));
    this.players = rawGameData.players;
    this.state = rawGameData.state;

    this.initialize();
  }
}
