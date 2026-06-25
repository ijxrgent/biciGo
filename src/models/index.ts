// src/models/index.ts

import { User } from "./business/User.js";
import { Brand } from "./business/Brand.js";
import { BikeCategory } from "./business/BikeCategory.js";
import { Bike } from "./business/Bike.js";
import { Rate } from "./business/Rate.js";
import { Rental } from "./business/Rental.js";
import { RentalDetails } from "./business/RentalDetails.js";
import { Maintenance } from "./business/Maintenance.js";
import { PenaltyType } from "./business/PenaltyType.js";
import { Penalty } from "./business/Penalty.js";
import { Sale } from "./business/Sale.js";
import { SaleDetails } from "./business/SaleDetails.js";

/*
|--------------------------------------------------------------------------
| Brand ↔ Bike
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

/*
|--------------------------------------------------------------------------
| BikeCategory ↔ Bike
|--------------------------------------------------------------------------
*/

BikeCategory.hasMany(Bike, {
  foreignKey: "bike_category_id",
  as: "bikes",
});

Bike.belongsTo(BikeCategory, {
  foreignKey: "bike_category_id",
  as: "bikeCategory",
});

/*
|--------------------------------------------------------------------------
| User ↔ Rental
|--------------------------------------------------------------------------
*/

User.hasMany(Rental, {
  foreignKey: "user_id",
  as: "rentals",
});

Rental.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

/*
|--------------------------------------------------------------------------
| Rate ↔ Rental
|--------------------------------------------------------------------------
*/

Rate.hasMany(Rental, {
  foreignKey: "rate_id",
  as: "rentals",
});

Rental.belongsTo(Rate, {
  foreignKey: "rate_id",
  as: "rate",
});

/*
|--------------------------------------------------------------------------
| Rental ↔ RentalDetails
|--------------------------------------------------------------------------
*/

Rental.hasMany(RentalDetails, {
  foreignKey: "rental_id",
  as: "details",
});

RentalDetails.belongsTo(Rental, {
  foreignKey: "rental_id",
  as: "rental",
});

/*
|--------------------------------------------------------------------------
| Bike ↔ RentalDetails
|--------------------------------------------------------------------------
*/

Bike.hasMany(RentalDetails, {
  foreignKey: "bike_id",
  as: "rental_details",
});

RentalDetails.belongsTo(Bike, {
  foreignKey: "bike_id",
  as: "bike",
});

/*
|--------------------------------------------------------------------------
| Bike ↔ Maintenance
|--------------------------------------------------------------------------
*/

Bike.hasMany(Maintenance, {
  foreignKey: "bike_id",
  as: "maintenances",
});

Maintenance.belongsTo(Bike, {
  foreignKey: "bike_id",
  as: "bike",
});

/*
|--------------------------------------------------------------------------
| Rental ↔ Penalty
|--------------------------------------------------------------------------
*/

Rental.hasMany(Penalty, {
  foreignKey: "rental_id",
  as: "penalties",
});

Penalty.belongsTo(Rental, {
  foreignKey: "rental_id",
  as: "rental",
});

/*
|--------------------------------------------------------------------------
| PenaltyType ↔ Penalty
|--------------------------------------------------------------------------
*/

PenaltyType.hasMany(Penalty, {
  foreignKey: "penalty_type_id",
  as: "penalties",
});

Penalty.belongsTo(PenaltyType, {
  foreignKey: "penalty_type_id",
  as: "penalty_type",
});

User.hasMany(Sale, {
  foreignKey: "user_id",
  as: "sales",
});

Sale.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

Sale.hasMany(SaleDetails, {
  foreignKey: "sale_id",
  as: "details",
});

SaleDetails.belongsTo(Sale, {
  foreignKey: "sale_id",
  as: "sale",
});

Bike.hasMany(SaleDetails, {
  foreignKey: "bike_id",
  as: "sale_details",
});

SaleDetails.belongsTo(Bike, {
  foreignKey: "bike_id",
  as: "bike",
});

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

export {
  User,
  Brand,
  BikeCategory,
  Bike,
  Rate,
  Rental,
  RentalDetails,
  Maintenance,
  PenaltyType,
  Penalty,
  Sale,
  SaleDetails,
};