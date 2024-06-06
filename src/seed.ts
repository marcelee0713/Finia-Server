import { db } from "./db/db.server";

import * as bycrypt from "bcrypt";

const main = async () => {
  try {
    const adminUsername = process.env.ADMIN_USERNAME as string;
    const adminEmailAddress = process.env.ADMIN_EMAIL_ADDRESS as string;
    const adminPassword = process.env.ADMIN_PASSWORD as string;

    await db.categories.createMany({
      data: [
        {
          transaction_type: "EXPENSES",
          category: "Housing",
        },

        {
          transaction_type: "EXPENSES",
          category: "Transportation",
        },

        {
          transaction_type: "EXPENSES",
          category: "Food",
        },

        {
          transaction_type: "EXPENSES",
          category: "Utilities",
        },

        {
          transaction_type: "EXPENSES",
          category: "Healthcare",
        },

        {
          transaction_type: "EXPENSES",
          category: "Personal Care",
        },

        {
          transaction_type: "EXPENSES",
          category: "Entertainment",
        },

        {
          transaction_type: "EXPENSES",
          category: "Debt Repayment",
        },

        {
          transaction_type: "EXPENSES",
          category: "Savings",
        },

        {
          transaction_type: "EXPENSES",
          category: "Gift/Donations",
        },

        {
          transaction_type: "EXPENSES",
          category: "Education",
        },

        {
          transaction_type: "EXPENSES",
          category: "Travel",
        },

        {
          transaction_type: "EXPENSES",
          category: "Clothing",
        },

        {
          transaction_type: "EXPENSES",
          category: "Misc",
        },

        {
          transaction_type: "REVENUE",
          category: "Salary",
        },

        {
          transaction_type: "REVENUE",
          category: "Freelance/Contract Work",
        },

        {
          transaction_type: "REVENUE",
          category: "Business Income",
        },

        {
          transaction_type: "REVENUE",
          category: "Investment Income",
        },

        {
          transaction_type: "REVENUE",
          category: "Rental Income",
        },

        {
          transaction_type: "REVENUE",
          category: "Interest/Dividends",
        },

        {
          transaction_type: "REVENUE",
          category: "Pension",
        },

        {
          transaction_type: "REVENUE",
          category: "Gift/Inheritance",
        },

        {
          transaction_type: "REVENUE",
          category: "Other",
        },
      ],
    });

    await db.user.createMany({
      data: [
        {
          username: "johndoe123",
          email: "john@example.com",
          password: await bycrypt.hash("P@ssword123", 10),
          emailVerified: new Date().toISOString(),
          role: "USER",
        },
        {
          username: adminUsername,
          email: adminEmailAddress,
          password: await bycrypt.hash(adminPassword, 10),
          emailVerified: new Date().toISOString(),
          role: "ADMIN",
        },
      ],
    });
  } catch (err) {
    throw new Error("Unexpected error when seeding, the errors: " + err);
  } finally {
    await db.$disconnect();
    process.exit();
  }
};

main();
