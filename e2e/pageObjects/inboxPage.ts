import { Page, expect } from "playwright/test";

export class InboxPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async clickSimulateConversationButton() {
    await this.page
      .getByRole("button", {
        name: "Simulate a conversation",
      })
      .click();
  }

  async clearUnassignedLiveChats() {
    await this.page.locator(`[data-test-id="inbox-section-button"]`).click();
    await this.openLiveChatInbox("Unassigned");
    const simulateConversationVisible = await this.page
      .getByRole("button", {
        name: "Simulate a conversation",
      })
      .isVisible();

    if (simulateConversationVisible) {
      return;
    }

    const goToMyOpenVisible = await this.page
      .getByRole("button", {
        name: "Go to My open",
      })
      .isVisible();

    if (goToMyOpenVisible) {
      return;
    }

    await this.deleteMessage();
  }

  async openLiveChatInbox(inboxName: string) {
    await this.page
      .locator(`button.nav-item`)
      .filter({ hasText: inboxName })
      .first()
      .click();
  }

  async clearMyOpenLiveChats() {
    await this.page.locator(`[data-test-id="inbox-section-button"]`).click();
    await this.openLiveChatInbox("My Open");
    const simulateConversationVisible = await this.page
      .getByRole("button", {
        name: "Simulate a conversation",
      })
      .isVisible();
    if (simulateConversationVisible) {
      return;
    }
    const goToUnassignedVisible = await this.page
      .getByRole("button", {
        name: "Go to Unassigned",
      })
      .isVisible();

    if (goToUnassignedVisible) {
      return;
    }

    {
      await this.deleteMessage();
    }
  }

  async findLastChatByEmail(email: string) {
    await this.page.locator("li").filter({ hasText: email }).first().click();
  }

  async assertCustomerMessage(email: string, message: string) {
    await expect(
      this.page
        .locator(`div.conversation`)
        .locator(`div.message-wrapper`)
        .filter({ hasText: email })
        .locator(`span:has-text("${message}")`)
    ).toBeVisible();
  }

  async assertOperatorMessage(message: string) {
    await expect(
      this.page
        .locator(`div.conversation`)
        .locator(`div.message-wrapper`)
        .last()
        .locator(`span:has-text("${message}")`)
    ).toBeVisible();
  }

  async clickReplyToCustomerButton() {
    await this.page
      .getByRole("button", {
        name: "Join conversation",
      })
      .click();
  }

  async replyToCustomerMessage(reply: string) {
    await this.page
      .locator(`[data-test-id="new-message-textarea"]`)
      .fill(reply);
    await this.page.keyboard.press("Enter");
  }

  async deleteMessage() {
    const moreOptions = await this.page
      .locator(`div.conversation`)
      .getByRole("button")
      .getByLabel("More options");
    const confirmRemoval = await this.page.getByRole("button", {
      name: "Yes, remove it",
    });
    const deleteButton = await this.page.getByRole("button", {
      name: "Delete",
    });
    await moreOptions.click();
    await deleteButton.click();
    await confirmRemoval.click();
  }
}
