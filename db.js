const Sequelize = require("sequelize");
const conn = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/product_offerings_api"
);

const uuidDefinition = {
  type: Sequelize.UUID,
  primaryKey: true,
  defaultValue: Sequelize.UUIDV4
};
const nameDefinition = {
  type: Sequelize.STRING,
  allowNull: false,
  unique: true,
  notEmpty: true
};

const Product = conn.define("product", {
  id: uuidDefinition,
  name: nameDefinition,
  suggestedPrice: Sequelize.DECIMAL
});
const Company = conn.define("company", {
  id: uuidDefinition,
  name: nameDefinition
});
const Offering = conn.define("offering", {
  id: uuidDefinition,
  name: nameDefinition,
  price: Sequelize.DECIMAL
});
Offering.belongsTo(Product);
Offering.belongsTo(Company);
Product.hasMany(Offering, { foreignKey: "productId" });
Company.hasMany(Offering, { foreignKey: "companyId" });

const sync = async () => {
  await conn.sync({ force: true });
  const [foo, bar, bazz] = await Promise.all([
    Product.create({ name: "Foo", suggestedPrice: "400" }),
    Product.create({ name: "Bar", suggestedPrice: "100000" }),
    Product.create({ name: "Bazz", suggestedPrice: "500000" })
  ]);

  const [quq, fuzz, poo] = await Promise.all([
    Company.create({ name: "QUQ" }),
    Company.create({ name: "FUZZ" }),
    Company.create({ name: "POO" })
  ]);

  const [off1, off2, off3] = await Promise.all([
    Offering.create({
      name: "OFF1",
      price: "10000000",
      productId: foo.id,
      companyId: poo.id
    }),
    Offering.create({
      name: "OFF2",
      price: "20000000",
      productId: bar.id,
      companyId: fuzz.id
    }),
    Offering.create({
      name: "OFF3",
      price: "30000000",
      productId: bazz.id,
      companyId: quq.id
    })
  ]);
};

module.exports = {
  sync,
  models: {
    Product,
    Company,
    Offering
  }
};
