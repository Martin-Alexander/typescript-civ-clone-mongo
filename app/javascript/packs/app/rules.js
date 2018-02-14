const Rules = {};

Rules.rulesJSON = rulesJSON;

// Given a unit, the square it one, and the player who owns it: What are it's available orders
Rules.ordersForUnit = function(unit, square = null, player = null) {
  switch(unit.type) {
    case "worker":
      return this._ordersForWorker(unit, square, player);
    default:
      return rulesJSON.units[unit.type].allowed_orders;
  }
}

// Returns the type of a given order
Rules.orderType = function(order) {
  return rulesJSON.orders[order].type;
}

// Returns the structure of a given construction order
Rules.constructionOrderStructure = function(order) {
  if (this.orderType(order) !== "construction") {
    console.error(`${order} is not a construction order`);
  }

  return rulesJSON.orders[order].structure;
}

Rules._ordersForWorker = function(unit, square = null, player = null) {
  this._checkUnitSquareAndPlayerForExistance(unit, square, player);

  const allowedOrders = [];

  rulesJSON.units.worker.allowed_orders.forEach((order) => {
    if (rulesJSON.orders[order].type === "construction") {
      if (order === "build_city") {
        if (player.growth > 0) allowedOrders.push(order); 
      } else {
        if (!square.hasCompletedStructure(this.constructionOrderStructure(order))) {
          allowedOrders.push(order);
        }
      }
    } 
  });

  return allowedOrders;
}

Rules._checkUnitSquareAndPlayerForExistance = function(unit, square, player) {
  if (!(unit && square && player)) {
    console.error("Must provide unit, square, and player");
  }
}

export { Rules };