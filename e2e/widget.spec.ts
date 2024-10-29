import { test } from "@playwright/test";
import { InboxPage } from "./pageObjects/inboxPage";
import { ChatPopupFrame } from "./pageObjects/chatPopupFrame";
import { performLogin } from "./utils/login";
import { faker } from "@faker-js/faker";

test.describe("Widget tests", () => {
  let inbox: InboxPage;
  let chat: ChatPopupFrame;

  test.beforeEach(async ({ page }) => {
    inbox = new InboxPage(page);
    chat = new ChatPopupFrame(page);
  });

  test("Send message from widget to panel and from panel to widget", async ({
    page,
  }) => {
    let chatPopUpFrame: ChatPopupFrame;

    const customerMessage = faker.lorem.sentences(2);
    const customerEmail = faker.internet.email();
    const operatorMessage = faker.lorem.sentences(5);

    await test.step("Login to project", async () => {
      await performLogin(page);
    });

    await test.step("Clear live chat inboxes", async () => {
      await inbox.clearUnassignedLiveChats();
      await inbox.clearMyOpenLiveChats();
    });

    await test.step("Simulate visitor and send message from widget to panel", async () => {
      const chatPopup = await chat.waitForNewPage(() =>
        inbox.clickSimulateConversationButton()
      );
      chatPopUpFrame = new ChatPopupFrame(chatPopup);
      await chatPopUpFrame.clickChatButton();
      await chatPopUpFrame.sendMessage(customerMessage);
      await chatPopUpFrame.fillEmailAddress(customerEmail);
      await chatPopUpFrame.assertMessageSent(customerMessage);
      await chatPopUpFrame.assertEmailAssigned(customerEmail);

      await inbox.openLiveChatInbox("Unassigned");
      await inbox.findLastChatByEmail(customerEmail);
      await inbox.assertCustomerMessage(customerEmail, customerMessage);
    });

    await test.step("Send a reply message from the panel", async () => {
      await inbox.clickReplyToCustomerButton();
      await inbox.replyToCustomerMessage(operatorMessage);
      await inbox.assertOperatorMessage(operatorMessage);

      await chatPopUpFrame.assertMessageReceived(operatorMessage);
    });
  });
});
