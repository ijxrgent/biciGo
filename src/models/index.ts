import { User } from "./business/User.js";
import { Brand } from "./business/Brand.js";
import { BikeCategory } from "./business/BikeCategory.js";
import { Bike } from "./business/Bike.js";

/*
|--------------------------------------------------------------------------
| Associations
|--------------------------------------------------------------------------
*/

Brand.hasMany(Bike, {
  foreignKey: "brand_id",
  as: "bikes",
});

Bike.belongsTo(Brand, {
  foreignKey: "brand_id",
  as: "brand",
});

BikeCategory.hasMany(Bike, {
  foreignKey: "bike_category_id",
  as: "bikes",
});

Bike.belongsTo(BikeCategory, {
  foreignKey: "bike_category_id",
  as: "category",
});

export {
  User,
  Brand,
  BikeCategory,
  Bike,
};