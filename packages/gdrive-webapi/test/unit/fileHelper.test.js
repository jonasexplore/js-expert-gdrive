import { describe, test, expect, jest } from "@jest/globals";
import fs from "fs";
import FileHelper from "../../src/fileHelper.js";

describe("FileHelper", () => {
  describe("getFileStatus", () => {
    test("it should return files statuses in correct format", async () => {
      const statMock = {
        dev: 2050,
        mode: 33279,
        nlink: 1,
        uid: 1000,
        gid: 1000,
        rdev: 0,
        blksize: 4096,
        ino: 142073,
        size: 263403,
        blocks: 520,
        atimeMs: 1630951849057.2244,
        mtimeMs: 1629809673992.886,
        ctimeMs: 1630951848856.5264,
        birthtimeMs: 0,
        atime: "2021-09-06T18:10:49.057Z",
        mtime: "2021-08-24T12:54:33.993Z",
        ctime: "2021-09-06T18:10:48.857Z",
        birthtime: "1970-01-01T00:00:00.000Z",
      };

      const mockUser = "fallying";
      process.env.USER = mockUser;
      const filename = "file.png";

      jest
        .spyOn(fs.promises, fs.promises.readdir.name)
        .mockResolvedValue([filename]);

      jest
        .spyOn(fs.promises, fs.promises.stat.name)
        .mockResolvedValue(statMock);

      const result = await FileHelper.getFileStatus("/tmp");

      const expectedResult = [
        {
          size: "263 kB",
          lastModified: statMock.birthtime,
          owner: mockUser,
          file: filename,
        },
      ];

      expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${filename}`);
      expect(result).toMatchObject(expectedResult);
    });
  });
});
