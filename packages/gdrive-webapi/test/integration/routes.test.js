import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  jest,
} from "@jest/globals";
import Routes from "./../../src/routes.js";
import FormData from "form-data";
import TestUtil from "../_util/testUtil";
import fs from "fs";
import { logger } from "../../src/logger.js";
import { tmpdir } from "os";
import { join } from "path";

describe("Routes Integration Test", () => {
  let defaultDownloadsFolder = "";
  beforeAll(async () => {
    defaultDownloadsFolder = await fs.promises.mkdtemp(
      join(tmpdir(), "downloads-")
    );
  });

  afterAll(async () => {
    await fs.promises.rm(defaultDownloadsFolder, { recursive: true });
  });

  beforeEach(() => {
    jest.spyOn(logger, "info").mockImplementation();
  });

  describe("getFileStatus", () => {
    const ioObj = {
      to: (id) => ioObj,
      emit: (event, message) => {},
    };

    test("should upload file to the folder", async () => {
      const filename = "shinobu-wallpaper-4k.jpeg";
      const fileStream = fs.createReadStream(
        `./test/integration/mocks/${filename}`
      );
      const response = TestUtil.generateWritableStream(() => {});

      const form = new FormData();
      form.append("photo", fileStream);

      const defaultParams = {
        request: Object.assign(form, {
          headers: form.getHeaders(),
          method: "POST",
          url: "?socketId=10",
        }),
        response: Object.assign(response, {
          setHeader: jest.fn(),
          writeHead: jest.fn(),
          end: jest.fn(),
        }),
        values: () => Object.values(defaultParams),
      };

      const routes = new Routes(defaultDownloadsFolder);

      routes.setSocketInstance(ioObj);

      const dirBeforeRun = await fs.promises.readdir(defaultDownloadsFolder);
      expect(dirBeforeRun).toEqual([]);

      await routes.handler(...defaultParams.values());

      const dirAfterRun = await fs.promises.readdir(defaultDownloadsFolder);
      expect(dirAfterRun).toEqual([filename]);

      expect(defaultParams.response.writeHead).toHaveBeenCalledWith(200);
      const exepectedResult = JSON.stringify({
        result: "Files uploaded with success!",
      });
      expect(defaultParams.response.end).toHaveBeenCalledWith(exepectedResult);
    });
  });
});
