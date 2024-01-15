import { getCollectionByOrder } from "../src/Api/FirebaseDb"; // mock the FirebaseDb module
import { auth } from "../firebaseConfig"; // mock the firebaseConfig module

jest.mock("../src/Api/FirebaseDb"); // mock the FirebaseDb module
jest.mock("../firebaseConfig"); // mock the firebaseConfig module

describe("fetchData function", () => {
  afterEach(() => {
    jest.resetAllMocks(); // reset all mocks after each test
  });

  it("should fetch data and set state correctly", async () => {
    const itemsData = [
      { id: 1, title: "Title 1" },
      { id: 2, title: "Title 2" },
    ];
    const snapshot = {
      docs: itemsData.map((item) => ({
        id: item.id,
        data: jest.fn(() => item),
      })),
    };
    getCollectionByOrder.mockResolvedValue(snapshot);
    const setItems = jest.fn();
    const setLastVisible = jest.fn();
    const setProfileImg = jest.fn();

    expect(setItems).toBeCalledTimes(0);
    expect(setLastVisible).toBeCalledTimes(0);
  });
});
