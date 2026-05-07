import { beforeEach, describe, expect, it } from "vitest";

import { useFavoritesStore } from "../stores/favoritesStore";

describe("favorites store", () => {
  beforeEach(() => {
    localStorage.clear();
    useFavoritesStore.setState({
      items: [],
      drawerOpen: false,
    });
  });

  it("toggles a product on and off by productId", () => {
    const input = {
      productId: "p-1",
      slug: "shoe-one",
      name: "Shoe One",
      image: "/shoe-one.jpg",
    };

    useFavoritesStore.getState().toggleProduct(input);
    expect(useFavoritesStore.getState().items).toHaveLength(1);

    useFavoritesStore.getState().toggleProduct(input);
    expect(useFavoritesStore.getState().items).toHaveLength(0);
  });

  it("prepends newly saved products", () => {
    useFavoritesStore.getState().toggleProduct({
      productId: "p-1",
      slug: "shoe-one",
      name: "Shoe One",
      image: "/shoe-one.jpg",
    });
    useFavoritesStore.getState().toggleProduct({
      productId: "p-2",
      slug: "shoe-two",
      name: "Shoe Two",
      image: "/shoe-two.jpg",
    });

    const { items } = useFavoritesStore.getState();
    expect(items).toHaveLength(2);
    expect(items[0]?.productId).toBe("p-2");
    expect(items[1]?.productId).toBe("p-1");
  });

  it("removes a product by productId", () => {
    useFavoritesStore.getState().toggleProduct({
      productId: "p-1",
      slug: "shoe-one",
      name: "Shoe One",
      image: "/shoe-one.jpg",
    });

    useFavoritesStore.getState().removeProduct("p-1");
    expect(useFavoritesStore.getState().items).toHaveLength(0);
  });
});
