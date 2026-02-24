import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getPublicImageUrl,
  uploadImage,
  uploadImageFromUrl,
  uploadImageUnified,
} from "./storage";

const { fromStorageMock, uploadMock, getPublicUrlMock } = vi.hoisted(() => ({
  fromStorageMock: vi.fn(),
  uploadMock: vi.fn(),
  getPublicUrlMock: vi.fn(),
}));

vi.mock("./supabase", () => ({
  supabase: {
    storage: {
      from: fromStorageMock,
    },
  },
}));

describe("storage helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fromStorageMock.mockReturnValue({
      getPublicUrl: getPublicUrlMock,
      upload: uploadMock,
    });
  });

  it("getPublicImageUrl returns null when path is empty", () => {
    expect(getPublicImageUrl("products", null)).toBeNull();
    expect(fromStorageMock).not.toHaveBeenCalled();
  });

  it("getPublicImageUrl returns public url", () => {
    getPublicUrlMock.mockReturnValue({
      data: { publicUrl: "https://cdn/p.png" },
    });

    const result = getPublicImageUrl("products", "p.png");

    expect(result).toBe("https://cdn/p.png");
    expect(fromStorageMock).toHaveBeenCalledWith("products");
    expect(getPublicUrlMock).toHaveBeenCalledWith("p.png");
  });

  it("uploadImage uploads file and returns final name", async () => {
    uploadMock.mockResolvedValue({ error: null });
    const file = new File(["img"], "avatar.png", { type: "image/png" });

    const result = await uploadImage("products", file, "custom.png");

    expect(result).toBe("custom.png");
    expect(uploadMock).toHaveBeenCalledWith("custom.png", file, {
      upsert: true,
      contentType: "image/png",
    });
  });

  it("uploadImageFromUrl fetches and uploads remote image", async () => {
    uploadMock.mockResolvedValue({ error: null });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      blob: async () => new Blob(["abc"], { type: "image/jpeg" }),
    } as Response);

    const result = await uploadImageFromUrl(
      "products",
      "https://cdn/source.jpg",
      "source.jpg"
    );

    expect(result).toBe("source.jpg");
    expect(fetchMock).toHaveBeenCalledWith("https://cdn/source.jpg");
    fetchMock.mockRestore();
  });

  it("uploadImageUnified handles null and string/file sources", async () => {
    uploadMock.mockResolvedValue({ error: null });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      blob: async () => new Blob(["abc"], { type: "image/png" }),
    } as Response);

    expect(await uploadImageUnified("products", null, "x.png")).toBeNull();
    expect(
      await uploadImageUnified("products", "https://cdn/source.png", "source.png")
    ).toBe("source.png");

    const file = new File(["z"], "f.png", { type: "image/png" });
    expect(await uploadImageUnified("products", file, "file.png")).toBe("file.png");

    fetchMock.mockRestore();
  });
});
