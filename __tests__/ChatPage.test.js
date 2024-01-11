import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Chat from "../src/screens/ChatPage";
import { auth, db } from "../firebaseConfig";
import { updateDataWithId } from "../src/Api/FirebaseDb";

jest.mock("../src/Api/FirebaseDb");

const { JSDOM } = require("jsdom");
const jsdom = new JSDOM("<!doctype html><html><body></body></html>");
const { window } = jsdom;

global.window = window;
global.document = window.document;

describe("Chat", () => {
  const currentUserUid = "123";
  const receiverId = "456";
  const postId = "789";
  const userData = {
    profileImgURI: "https://example.com/profile.png",
    firstName: "John",
  };
  const ownerData = {
    profileImgURI: "https://example.com/owner.png",
    firstName: "Jane",
  };

  beforeAll(() => {
    auth.currentUser = {
      uid: currentUserUid,
    };
  });

  beforeEach(() => {
    updateDataWithId.mockClear();
  });

  test("renders messages", async () => {
    const messages = [
      {
        senderUid: currentUserUid,
        recipientUid: receiverId,
        message: "Hello",
        created: new Date(),
      },
      {
        senderUid: receiverId,
        recipientUid: currentUserUid,
        message: "Hi",
        created: new Date(),
      },
    ];

    const docData = {
      chats: messages,
    };

    const onSnapshotMock = jest.fn();
    onSnapshotMock.mockReturnValue({
      data: () => docData,
    });

    const docMock = jest.fn();
    docMock.mockReturnValue({
      onSnapshot: onSnapshotMock,
    });

    db.doc = jest.fn().mockReturnValue(docMock());

    render(
      <Chat
        route={{ params: { receiverId, title: "Title", postId } }}
        navigation={{ navigate: jest.fn() }}
      />
    );

    await screen.findByText("Hello");
    await screen.findByText("Hi");
  });

  test("saves message", async () => {
    const message = "Hello";

    const docData = {
      chats: [
        {
          senderUid: currentUserUid,
          recipientUid: receiverId,
          message: "Hi",
          created: new Date(),
        },
      ],
    };

    const onSnapshotMock = jest.fn();
    onSnapshotMock.mockReturnValue({
      data: () => docData,
    });

    const docMock = jest.fn();
    docMock.mockReturnValue({
      onSnapshot: onSnapshotMock,
    });

    db.doc = jest.fn().mockReturnValue(docMock());

    render(
      <Chat
        route={{ params: { receiverId, title: "Title", postId } }}
        navigation={{ navigate: jest.fn() }}
      />
    );

    const input = screen.getByPlaceholderText("Type your message here");
    const sendButton = screen.getByRole("button", { name: "Send" });

    userEvent.type(input, message);
    userEvent.click(sendButton);

    await waitFor(() => {
      expect(updateDataWithId).toHaveBeenCalledTimes(1);
      expect(updateDataWithId).toHaveBeenCalledWith(
        "chats",
        {
          chats: expect.arrayContaining([
            expect.objectContaining({
              senderUid: currentUserUid,
              recipientUid: receiverId,
              message,
            }),
          ]),
        },
        `${currentUserUid}${postId}`
      );
    });
  });

  test("renders received message", async () => {
    const currentUserUid = "123";
    const receiverId = "456";
    const postId = "789";
    const chatData = {
      senderUid: receiverId,
      recipientUid: currentUserUid,
      message: "Hello",
      created: new Date(),
    };

    expect(getByText(chatData.message)).toBeInTheDocument();
  });

  test("navigates to profile", async () => {
    const { getByTestId, getByAltText } = render(
      <Chat
        route={{
          params: {
            receiverId,
            title: "Title",
            postId,
            userData,
            ownerData,
          },
        }}
        navigation={{ navigate: jest.fn() }}
      />
    );

    const profileImg = getByAltText(userData.firstName);
    fireEvent.press(profileImg);

    await waitFor(() => {
      expect(getByTestId("profile-modal")).toBeTruthy();
      expect(getByTestId("profile-img")).toHaveProp(
        "source",
        userData.profileImgURI
      );
      expect(getByText(userData.firstName)).toBeTruthy();
    });
  });
});
