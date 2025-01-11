import { Product } from "@/types";

export function slugify(text: string): string {
    return text
      .toLowerCase() // Convert to lowercase
      .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters (except spaces and hyphens)
      .trim() // Remove leading and trailing whitespace
      .replace(/\s+/g, "-"); // Replace spaces with hyphens
  }

export function getProductUrl(product: Product) {
    return `/${slugify(product.name)}/p/${product.id}`;
}
