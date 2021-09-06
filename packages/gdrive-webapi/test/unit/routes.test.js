import { describe, test, expect, jest } from "@jest/globals";
import Routes from "./../../src/routes.js";

describe("Routes test suite", () => {
  const defaultParams = {
    request: {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      method: "",
      body: {},
    },
    response: {
      setHeader: jest.fn(),
      writeHead: jest.fn(),
      end: jest.fn(),
    },
    values: () => Object.values(defaultParams),
  };

  describe("setSocketInstance", () => {
    test("setSocket should store io instance", () => {
      const routes = new Routes();
      const ioObj = {
        to: (id) => ioObj,
        emit: (event, message) => {},
      };

      routes.setSocketInstance(ioObj);

      expect(routes.io).toStrictEqual(ioObj);
    });
  });

  describe("handler", () => {
    test("given an inexistent route if should choose default route", async () => {
      const routes = new Routes();

      const params = { ...defaultParams };

      params.request.method = "inexistent";
      await routes.handler(...params.values());

      expect(params.response.end).toHaveBeenCalledWith("hello world");
    });

    test("it should set any request with CORS enabled", async () => {
      const routes = new Routes();

      const params = { ...defaultParams };

      params.request.method = "inexistent";
      await routes.handler(...params.values());

      expect(params.response.setHeader).toHaveBeenCalledWith(
        "Access-Control-Allow-Origin",
        "*"
      );
    });

    test("given method OPTIONS it should choose options route", async () => {
      const routes = new Routes();

      const params = { ...defaultParams };

      params.request.method = "OPTIONS";
      await routes.handler(...params.values());

      expect(params.response.writeHead).toHaveBeenCalledWith(204);
      expect(params.response.end).toHaveBeenCalled();
    });

    test("given method POST it should choose options route", async () => {
      const routes = new Routes();

      const params = { ...defaultParams };

      params.request.method = "POST";
      jest.spyOn(routes, routes.post.name).mockResolvedValue();

      await routes.handler(...params.values());

      expect(routes.post).toHaveBeenCalled();
    });

    test("given method GET it should choose options route", async () => {
      const routes = new Routes();

      const params = { ...defaultParams };

      params.request.method = "GET";
      jest.spyOn(routes, routes.get.name).mockResolvedValue();

      await routes.handler(...params.values());

      expect(routes.get).toHaveBeenCalled();
    });
  });

  describe("Get", () => {
    test("given method GET is should list all files downloaded", async () => {
      const routes = new Routes();

      const params = {
        ...defaultParams,
      };

      const filesStatusesMock = [
        {
          size: "263 kB",
          lastModified: "1970-01-01T00:00:00.000Z",
          owner: "fallying",
          file: "file.png",
        },
      ];

      jest
        .spyOn(routes.fileHelper, routes.fileHelper.getFileStatus.name)
        .mockResolvedValue(filesStatusesMock);

      params.request.method = "GET";
      await routes.handler(...params.values());

      expect(params.response.writeHead).toHaveBeenCalledWith(200);
      expect(params.response.end).toHaveBeenCalledWith(
        JSON.stringify(filesStatusesMock)
      );
    });
  });
});