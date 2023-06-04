import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import {
  categories,
  configs,
  products,
  parcelLocations,
  countries,
  productsToCategories,
  orders,
  orderAddresses,
  orderItems,
  orderItemsRelations,
  ordersRelations
} from './schema'

export const db = drizzle(
  connect({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
  }),
  {
    logger: true,
    schema: {
      categories,
      configs,
      products,
      parcelLocations,
      countries,
      productsToCategories,
      orders,
      orderAddresses,
      orderItems,
      orderItemsRelations,
      ordersRelations
    }
  }
);
