import renderer from "react-test-renderer";
import React from "react";

jest.mock("../src/Api/FirebaseDb"); // mock the FirebaseDb module
jest.mock("../firebaseConfig"); // mock the firebaseConfig module

import App from "../src/screens/EditPage";

describe("<App />", () => {
  it("has 1 child", () => {
    const tree = renderer.create(<App></App>).toJSON();
    expect(tree.children.length).toBe(12);
  });
});
