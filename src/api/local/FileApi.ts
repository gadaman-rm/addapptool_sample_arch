import storage from "../../manager/store/Storage";
import apiPostRequest from "../utils/Utils";

const apiUrl = storage.localServiceAddress;

class FileApi {
  public async readFile(fileName: string, dirName: string | null = null): Promise<string | null> {
    const response = await apiPostRequest(
      `${apiUrl}/readFile`,
      { fileName, dirName },
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      }
    );
    return response.data.content;
  }

  public async writeFile(fileName: string, content: string, dirPath: string | null = null): Promise<void> {
    const response = await apiPostRequest(
      `${apiUrl}/writeFile`,
      { fileName, content, dirPath },
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      }
    );
    return response.data.success;
  }

  public async makeFileJsonObject(fileName: string): Promise<string | null> {
    const response = await apiPostRequest(
      `${apiUrl}/makeFileJsonObject`,
      { fileName },
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      }
    );
    return response.data.jsonObject;
  }

  public async deleteFile(fileName: string, dirName: string | null = null): Promise<boolean> {
    const response = await apiPostRequest(
      `${apiUrl}/deleteFile`,
      { fileName, dirName },
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      }
    );
    return response.data.success;
  }

  public async createDirectory(dirName: string): Promise<boolean> {
    const response = await apiPostRequest(
      `${apiUrl}/createDirectory`,
      { dirName },
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      }
    );
    return response.data.success;
  }

  public async deleteDirectory(dirName: string): Promise<boolean> {
    const response = await apiPostRequest(
      `${apiUrl}/deleteDirectory`,
      { dirName },
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      }
    );
    return response.data.success;
  }

  public async fileExists(fileName: string, dirName: string | null = null): Promise<boolean> {
    const response = await apiPostRequest(
      `${apiUrl}/fileExists`,
      { fileName, dirName },
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      }
    );
    return response.data.exist;
  }

  public async renameFile(oldName: string, newName: string, dirName?: string): Promise<boolean> {
    const response = await apiPostRequest(
      `${apiUrl}/renameFile`,
      { oldName, newName, dirName },
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      }
    );
    return response.data.success;
  }

  public async moveFile(fileName: string, oldDir?: string, newDir?: string): Promise<boolean> {
    const response = await apiPostRequest(
      `${apiUrl}/moveFile`,
      { fileName, oldDir, newDir },
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      }
    );
    return response.data.success;
  }

  public async setBaseDir(baseDir: string) {
    const response = await apiPostRequest(
      `${apiUrl}/setBaseDir`,
      { baseDir },
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      }
    );
    return response.data.success;
  }
}

const fileApi = new FileApi();
export default fileApi;
