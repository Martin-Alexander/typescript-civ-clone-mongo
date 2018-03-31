import RawStructureData from "./raw_structure_data";
import Square from "./square";

export default class Structure {
  readonly id: string;
  readonly type: string;
  readonly square: Square;
  readonly player_number: number;

  public complete: boolean;
  public construction_level: number;
  public size: number | null;

  constructor(rawStructureData: RawStructureData, square: Square) {
    this.square = square;
    this.id = rawStructureData._id.$oid;
    this.complete = rawStructureData.complete;
    this.construction_level = rawStructureData.construction_level;
    this.player_number = rawStructureData.player_number;
    this.type = rawStructureData.type;
    this.size = rawStructureData.size;
  };
  
  // This is all going away when artwork is done, so I'm not going to bother making it look nice
  public render(context: CanvasRenderingContext2D, UI: any): void {
    if (this.type === "city") {
      context.beginPath();
      context.ellipse(0, UI.tileHeight / 2, UI.tileWidth / 3, UI.tileHeight / 3, 0, Math.PI * 1.25, Math.PI * 0.25);
      context.fillStyle = this.typeColor();
      context.ellipse(0, UI.tileHeight / 2, UI.tileWidth / 3, UI.tileHeight / 3, 0, Math.PI * 0.25, Math.PI * 1.25);
      context.fillStyle = this.typeColor();
      context.fill();
    } else {
      context.beginPath();
      context.ellipse(0, UI.tileHeight / 2, UI.tileWidth / 3, UI.tileHeight / 3, 0, Math.PI * 1.25, Math.PI * 0.25);
      context.fillStyle = this.typeColor();
      context.fill();
      context.beginPath();
      context.ellipse(0, UI.tileHeight / 2, UI.tileWidth / 3, UI.tileHeight / 3, 0, Math.PI * 0.25, Math.PI * 1.25);
      context.fillStyle = this.playerColor();
      context.fill();
    }
  };

  // This is all going away when artwork is done, so I'm not going to bother making it look nice
  public renderLabel(square: Square, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, UI: any) {
    if (this.type === "city") {
      context.save();
      context.translate(
        (square.x - square.y) * (UI.tileWidth / 2) + (canvas.width / 2) + UI.offset.x, 
        ((square.y + square.x) * UI.tileHeight / 2) + UI.offset.y + ((canvas.height - 15 * UI.tileHeight) / 2)
      );
      context.font = `${(UI.tileHeight / 2)}px sans-serif`;
      context.fillStyle = this.playerColor();
      context.fillText(`${this.size}`, -(UI.tileHeight / 9), UI.tileHeight);
      context.restore();
    }
  };

  private typeColor(): string {
    const structureTypeColorLookup: { [key: string]: string } = {
      road: "#bf743f",
      fortress: "#3a3a3a",
      farm: "#627221",
      city: "#80a09f"
    }
  
    return structureTypeColorLookup[this.type];
  };

  private playerColor(): string {
    const structurePlayerColorLookup: { [key: number]: string } = {
      1: "red",
      2: "blue",
      3: "pink",
      4: "purple",
      5: "orange"
    };
  
    return structurePlayerColorLookup[this.player_number];
  };
}
