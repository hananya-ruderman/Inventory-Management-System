import { test, expect } from "@playwright/test";

test.beforeEach(async ({ request }) => {
  await request.post("http://localhost:3000/users", {
    data: {
      username: "testUser",
      password: "123456",
      role: "user",
    },
  });
});

test("user can login", async ({ page }) => {
  await page.goto("http://localhost:5173/login");

  await page.getByLabel("Username").fill("testUser");

  await page.getByLabel("Password").fill("123456");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/dashboard/);

  await expect(page.getByText("Dashboard")).toBeVisible();

  await page
    .getByRole("button", {
      name: "Add Item",
    })
    .click();

  await page.getByLabel("Name").fill("Laptop");

  await page.getByLabel("Price").fill("5000");

  await page.getByLabel("Quantity").fill("10");

  await page
    .getByRole("button", {
      name: "Save",
    })
    .click();

  await expect(page.getByText("Item added successfully")).toBeVisible();

  await expect(page.locator("tbody")).toContainText("Laptop", {
    timeout: 10000,
  });
});
