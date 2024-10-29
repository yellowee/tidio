import { Page } from "playwright/test";

export const performLogin = async (page: Page) => {
  await page.goto(
    `?project_public_key=${process.env.PROJECT_PUBLIC_KEY}&api_token=${process.env.API_TOKEN}`
  );
};
