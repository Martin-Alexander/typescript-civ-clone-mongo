function findAvailableMoves(unit, freshMoves) {
  if (freshMoves) {
    return Rules.baseMovementRateForUnit(unit);
  }

  return unit.moves;
}

export { findAvailableMoves };