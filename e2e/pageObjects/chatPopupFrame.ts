import { FrameLocator, Page, expect } from "@playwright/test";

export class ChatPopupFrame {
  readonly page: Page;
  readonly frameLocator: FrameLocator;

  constructor(page: Page) {
    this.page = page;
    this.frameLocator = page.frameLocator(`iframe[id="tidio-chat-iframe"]`);
  }

  async waitForNewPage(trigger: () => Promise<void>): Promise<Page> {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      trigger(),
    ]);
    return newPage;
  }

  async clickChatButton() {
    const button = this.frameLocator.locator(
      `[data-testid="widgetButtonBody"]`
    );
    await button.waitFor({ state: "visible" });
    await button.click();
  }

  async sendMessage(text: string) {
    const messageInput = this.frameLocator.locator(
      `[data-testid="newMessageTextarea"]`
    );
    await messageInput.fill(text);
    await this.page.keyboard.press("Enter");
  }

  async fillEmailAddress(email: string) {
    const emailInput = this.frameLocator.locator(`input[type="email"]`);
    await emailInput.fill(email);
    await this.page.keyboard.press("Enter");
  }

  async assertMessageSent(message: string) {
    const messageLocator = this.frameLocator.locator(`div.message-visitor`);
    await expect(messageLocator).toContainText(message);
  }

  async assertEmailAssigned(email: string) {
    const emailInput = this.frameLocator.locator(`input[type="email"]`);
    await expect(emailInput).toHaveValue(email);
  }

  async assertMessageReceived(message: string) {
    const lastOperatorMessage = this.frameLocator
      .locator(`div.message-operator`)
      .last();
    await expect(lastOperatorMessage).toContainText(message);
  }
}
