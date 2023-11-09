import { WebhoseToDiskImpl, WebhoseFetchRequest, WebhoseFetchResponse } from "../webhose";
import { mockWebhoseResponse } from "./response.utils";
import axios from "axios";
import fs from 'fs';
import path from 'path';

describe("index", () => {
  const token = 'test_token';
  const mockDir = 'webhose_test_post';
  const dir = path.join(__dirname, '..', '..', mockDir);
  let request: WebhoseFetchRequest;

  beforeEach(() => {
    request = {
      query: "food",
      size: 200,
    };
  });


  it("has moreResultsAvailable greater than 0", async () => {
    fs.mkdirSync(dir, { recursive: true });
    axios.get = jest.fn().mockResolvedValueOnce({
      data: mockWebhoseResponse(200, 1000)
    });
    const webhose = new WebhoseToDiskImpl(mockDir,token);
    const response = await webhose.fetch(request);
    expect(response).toEqual({ count: 200, totalCount: 1000 });
    fs.rmSync(dir, { recursive: true, force: true });

  });

  it("has moreResultsAvailable equal to 0", async () => {
    fs.mkdirSync(dir, { recursive: true });
    axios.get = jest.fn().mockResolvedValueOnce({
      data: mockWebhoseResponse(200, 100)
    });
    const webhose = new WebhoseToDiskImpl(mockDir,token);
    await webhose.fetch(request);
    const filesInDirectory = fs.readdirSync(dir);
    expect(filesInDirectory.length).toEqual(0);
    fs.rmSync(dir, { recursive: true, force: true });

  });

  it("should return object with count and totalCount", async () => {
    axios.get = jest.fn().mockResolvedValueOnce({
      data: mockWebhoseResponse(200, 100)
    });
    const webhose = new WebhoseToDiskImpl(mockDir, token);
    const response = await webhose.fetch(request);
    expect(typeof response).toEqual(typeof {});
    expect(response.count).toBeDefined();
    expect(response.totalCount).toBeDefined();
  });

  it("should handle errors when fetching data", async () => {
    axios.get = jest.fn().mockRejectedValue(new Error('Server Error'));
    const webhose = new WebhoseToDiskImpl(mockDir, token);
    try {
      await webhose.fetch(request);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("error fetching data");
    }
  });
});
