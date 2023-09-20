import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import { 
  categories,
  categoriesToChildren,
  configs,
  products,
  wishlistedProducts,
  productsToCategories,
  countries,
  menuItems,
  menus,
  orders,
  orderItems,
  orderAddresses,
  parcelLocations
} from './schema'
import { log } from 'next-axiom'
import { DefaultLogger } from 'drizzle-orm';

export const db = drizzle(
  connect({
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
  }),
  {
    logger: new DefaultLogger({
      writer: {
        write(message) {
            console.log(message)
            log.info(`Database ${message}`)
        },
      }
    }),
    schema: {
      categories,
      categoriesToChildren,
      configs,
      products,
      wishlistedProducts,
      productsToCategories,
      countries,
      menuItems,
      menus,
      orders,
      orderItems,
      orderAddresses,
      parcelLocations
    }
  }
);
