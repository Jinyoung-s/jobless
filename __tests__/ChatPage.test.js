import renderer from "react-test-renderer";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Chat from "../src/screens/ChatPage";
import { BackHandler } from "react-native";

import {
  firebaseConfig,
  initializeApp,
  getAuth,
  getFirestore,
  getStorage,
} from "../__mocks__/firebaseConfig";

jest.mock("../src/Api/FirebaseDb"); // mock the FirebaseDb module

jest.mock("../firebaseConfig", () => {
  const auth = {
    currentUser: {
      uid: "mockUserId123",
    },
  };
  return {
    auth,
    getFirestore: jest.fn(),
    collection: jest.fn(),
    addDoc: jest.fn(),
    getStorage: jest.fn(),
  };
});

const mockCollection = jest.fn();
const mockAddDoc = jest.fn();
const mockOnSnapshot = jest.fn();

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(() => ({
    add: mockAddDoc,
    orderBy: jest.fn(() => ({
      where: jest.fn(() => ({
        limit: jest.fn(() => ({
          onSnapshot: mockOnSnapshot,
        })),
      })),
    })),
  })),
  doc: jest.fn(() => {
    return {
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      get: jest.fn(),
      onSnapshot: jest.fn(),
    };
  }),
  onSnapshot: jest.fn((query, callback) => {
    callback({
      data: jest.fn(),
    });
  }),
}));

const mockRouteParams = {
  params: {
    postId: 1,
    receiverId: "mockReceiverId",
    title: "mockTitle",
  },
};

jest.mock("react-native", () => ({
  BackHandler: jest.fn(() => ({
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
}));

describe("<App />", () => {
  it("renders correctly", () => {
    const tree = renderer
      .create(
        <NavigationContainer>
          <Chat
            route={{
              params: {
                postId: 1,
                receiverId: "so",
                title: "test",
              },
            }}
          />
        </NavigationContainer>
      )
      .toJSON();
    expect(tree.children.length).toBe(1);
  });
});
