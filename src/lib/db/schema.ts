import {
  pgTable, pgEnum, uuid, varchar, text, integer, boolean, timestamp,
  jsonb, decimal, primaryKey, index, uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

/* ------------------------------------------------------------------ */
/* Enums                                                              */
/* ------------------------------------------------------------------ */
export const userRole = pgEnum("user_role", ["customer", "staff", "admin"]);
export const productStatus = pgEnum("product_status", ["draft", "active", "archived"]);
export const orderStatus = pgEnum("order_status", [
  "pending", "paid", "preparing", "shipped", "delivered", "cancelled", "refunded",
]);
export const paymentStatus = pgEnum("payment_status", [
  "pending", "approved", "rejected", "refunded", "chargeback",
]);
export const shippingStatus = pgEnum("shipping_status", [
  "pending", "label_purchased", "shipped", "in_transit", "delivered", "returned",
]);
export const couponType = pgEnum("coupon_type", ["percent", "fixed", "freeshipping"]);
export const collectionType = pgEnum("collection_type", ["manual", "rule"]);
export const reviewStatus = pgEnum("review_status", ["pending", "approved", "rejected"]);

/* ------------------------------------------------------------------ */
/* Users + addresses                                                  */
/* ------------------------------------------------------------------ */
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 120 }),
  phone: varchar("phone", { length: 30 }),
  cpf: varchar("cpf", { length: 14 }),
  role: userRole("role").notNull().default("customer"),
  marketingOptIn: boolean("marketing_opt_in").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const addresses = pgTable("addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  label: varchar("label", { length: 50 }),
  recipient: varchar("recipient", { length: 120 }).notNull(),
  cep: varchar("cep", { length: 9 }).notNull(),
  street: varchar("street", { length: 200 }).notNull(),
  number: varchar("number", { length: 20 }).notNull(),
  complement: varchar("complement", { length: 100 }),
  neighborhood: varchar("neighborhood", { length: 120 }).notNull(),
  city: varchar("city", { length: 120 }).notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({ userIdx: index("addresses_user_idx").on(t.userId) }));

/* ------------------------------------------------------------------ */
/* Catalog                                                            */
/* ------------------------------------------------------------------ */
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  parentId: uuid("parent_id"),
  imageUrl: text("image_url"),
  bannerUrl: text("banner_url"),
  position: integer("position").notNull().default(0),
  seoTitle: varchar("seo_title", { length: 200 }),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  brand: varchar("brand", { length: 80 }),
  categoryId: uuid("category_id").references(() => categories.id),
  status: productStatus("status").notNull().default("draft"),
  // prices in cents (BRL)
  basePrice: integer("base_price").notNull(),
  salePrice: integer("sale_price"),
  skuRoot: varchar("sku_root", { length: 60 }),
  weightG: integer("weight_g"),
  lengthCm: integer("length_cm"),
  widthCm: integer("width_cm"),
  heightCm: integer("height_cm"),
  seoTitle: varchar("seo_title", { length: 200 }),
  seoDescription: text("seo_description"),
  seoImage: text("seo_image"),
  ratingAvg: decimal("rating_avg", { precision: 3, scale: 2 }).default("0"),
  ratingCount: integer("rating_count").notNull().default(0),
  salesCount: integer("sales_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  categoryIdx: index("products_category_idx").on(t.categoryId),
  statusIdx: index("products_status_idx").on(t.status),
}));

export const productImages = pgTable("product_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  url: text("url").notNull(),
  alt: varchar("alt", { length: 200 }),
  position: integer("position").notNull().default(0),
}, (t) => ({ productIdx: index("product_images_product_idx").on(t.productId) }));

export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  sku: varchar("sku", { length: 80 }).notNull().unique(),
  size: varchar("size", { length: 30 }),
  color: varchar("color", { length: 50 }),
  priceOverride: integer("price_override"),
  stock: integer("stock").notNull().default(0),
  reserved: integer("reserved").notNull().default(0),
  imageId: uuid("image_id").references(() => productImages.id),
}, (t) => ({ productIdx: index("product_variants_product_idx").on(t.productId) }));

export const productAttributes = pgTable("product_attributes", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  key: varchar("key", { length: 60 }).notNull(),
  value: varchar("value", { length: 200 }).notNull(),
}, (t) => ({ productKeyIdx: index("product_attr_idx").on(t.productId, t.key) }));

/* ------------------------------------------------------------------ */
/* Collections                                                        */
/* ------------------------------------------------------------------ */
export const collections = pgTable("collections", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  name: varchar("name", { length: 120 }).notNull(),
  type: collectionType("type").notNull().default("manual"),
  ruleJson: jsonb("rule_json"),
  bannerUrl: text("banner_url"),
  position: integer("position").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

export const collectionProducts = pgTable("collection_products", {
  collectionId: uuid("collection_id").references(() => collections.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  position: integer("position").notNull().default(0),
}, (t) => ({ pk: primaryKey({ columns: [t.collectionId, t.productId] }) }));

/* ------------------------------------------------------------------ */
/* Coupons                                                            */
/* ------------------------------------------------------------------ */
export const coupons = pgTable("coupons", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  type: couponType("type").notNull(),
  value: integer("value").notNull(),
  minSubtotal: integer("min_subtotal"),
  maxUses: integer("max_uses"),
  used: integer("used").notNull().default(0),
  validFrom: timestamp("valid_from", { withTimezone: true }),
  validTo: timestamp("valid_to", { withTimezone: true }),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/* ------------------------------------------------------------------ */
/* Carts                                                              */
/* ------------------------------------------------------------------ */
export const carts = pgTable("carts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  sessionId: varchar("session_id", { length: 80 }),
  abandonedAt: timestamp("abandoned_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  userIdx: index("carts_user_idx").on(t.userId),
  sessionIdx: index("carts_session_idx").on(t.sessionId),
}));

export const cartItems = pgTable("cart_items", {
  cartId: uuid("cart_id").references(() => carts.id, { onDelete: "cascade" }).notNull(),
  variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "cascade" }).notNull(),
  qty: integer("qty").notNull().default(1),
  unitPrice: integer("unit_price").notNull(),
}, (t) => ({ pk: primaryKey({ columns: [t.cartId, t.variantId] }) }));

/* ------------------------------------------------------------------ */
/* Orders                                                             */
/* ------------------------------------------------------------------ */
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  userId: uuid("user_id").references(() => users.id),
  status: orderStatus("status").notNull().default("pending"),
  paymentStatus: paymentStatus("payment_status").notNull().default("pending"),
  shippingStatus: shippingStatus("shipping_status").notNull().default("pending"),
  subtotal: integer("subtotal").notNull(),
  discount: integer("discount").notNull().default(0),
  shipping: integer("shipping").notNull().default(0),
  total: integer("total").notNull(),
  couponCode: varchar("coupon_code", { length: 50 }),
  paymentMethod: varchar("payment_method", { length: 30 }),
  paymentId: varchar("payment_id", { length: 120 }),
  paymentRaw: jsonb("payment_raw"),
  shippingCarrier: varchar("shipping_carrier", { length: 60 }),
  shippingService: varchar("shipping_service", { length: 60 }),
  trackingCode: varchar("tracking_code", { length: 60 }),
  shippingAddress: jsonb("shipping_address").notNull(),
  billingAddress: jsonb("billing_address"),
  customerEmail: varchar("customer_email", { length: 320 }).notNull(),
  customerName: varchar("customer_name", { length: 120 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 30 }),
  customerCpf: varchar("customer_cpf", { length: 14 }),
  notesInternal: text("notes_internal"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  userIdx: index("orders_user_idx").on(t.userId),
  statusIdx: index("orders_status_idx").on(t.status),
  createdIdx: index("orders_created_idx").on(t.createdAt),
}));

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  variantId: uuid("variant_id").references(() => productVariants.id),
  qty: integer("qty").notNull(),
  unitPrice: integer("unit_price").notNull(),
  snapshot: jsonb("snapshot").notNull(),
}, (t) => ({ orderIdx: index("order_items_order_idx").on(t.orderId) }));

export const orderEvents = pgTable("order_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  type: varchar("type", { length: 60 }).notNull(),
  payload: jsonb("payload"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({ orderIdx: index("order_events_order_idx").on(t.orderId) }));

/* ------------------------------------------------------------------ */
/* Reviews + wishlist                                                 */
/* ------------------------------------------------------------------ */
export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  rating: integer("rating").notNull(),
  title: varchar("title", { length: 120 }),
  body: text("body"),
  status: reviewStatus("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({ productIdx: index("reviews_product_idx").on(t.productId) }));

export const wishlists = pgTable("wishlists", {
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({ pk: primaryKey({ columns: [t.userId, t.productId] }) }));

/* ------------------------------------------------------------------ */
/* Content blocks + audit + settings                                  */
/* ------------------------------------------------------------------ */
export const contentBlocks = pgTable("content_blocks", {
  id: uuid("id").defaultRandom().primaryKey(),
  slot: varchar("slot", { length: 60 }).notNull(),
  data: jsonb("data").notNull(),
  active: boolean("active").notNull().default(true),
  activeFrom: timestamp("active_from", { withTimezone: true }),
  activeTo: timestamp("active_to", { withTimezone: true }),
  position: integer("position").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({ slotIdx: index("content_blocks_slot_idx").on(t.slot) }));

export const adminAudit = pgTable("admin_audit", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id),
  action: varchar("action", { length: 60 }).notNull(),
  entity: varchar("entity", { length: 60 }).notNull(),
  entityId: varchar("entity_id", { length: 80 }),
  diff: jsonb("diff"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({ entIdx: index("admin_audit_entity_idx").on(t.entity, t.entityId) }));

export const settings = pgTable("settings", {
  key: varchar("key", { length: 80 }).primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const activityLogs = pgTable("activity_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  actorId: uuid("actor_id").references(() => users.id),
  action: varchar("action", { length: 30 }).notNull(), // created | updated | deleted
  entityType: varchar("entity_type", { length: 60 }).notNull(), // product | order | category | ...
  entityId: uuid("entity_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  actorIdx: index("activity_logs_actor_idx").on(t.actorId),
  entityIdx: index("activity_logs_entity_idx").on(t.entityType, t.entityId),
  createdIdx: index("activity_logs_created_idx").on(t.createdAt),
}));

/* ------------------------------------------------------------------ */
/* Relations                                                          */
/* ------------------------------------------------------------------ */
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  images: many(productImages),
  variants: many(productVariants),
  attributes: many(productAttributes),
  reviews: many(reviews),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, { fields: [categories.parentId], references: [categories.id], relationName: "parent" }),
  children: many(categories, { relationName: "parent" }),
  products: many(products),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
  events: many(orderEvents),
}));

export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  orders: many(orders),
  wishlist: many(wishlists),
}));
