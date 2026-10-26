import { Node } from "@tiptap/core";
import {
  affiliateSpec,
  normalizeAffiliate,
  type AffiliateAttrs,
} from "@/lib/affiliate-card";

/**
 * Bloco "Produto afiliado" do editor. É um nó atômico (não editável por dentro):
 * os dados ficam nos atributos e o desenho vem de `affiliateSpec`, o mesmo que o
 * servidor usa para montar o card no site público.
 */
export const AffiliateProduct = Node.create({
  name: "affiliateProduct",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    const fromData = (name: string) => (el: HTMLElement) =>
      el.getAttribute(name) ?? "";
    return {
      title: {
        default: "",
        rendered: false,
        parseHTML: fromData("data-title"),
      },
      imageUrl: {
        default: "",
        rendered: false,
        parseHTML: fromData("data-image-url"),
      },
      price: {
        default: "",
        rendered: false,
        parseHTML: fromData("data-price"),
      },
      link: { default: "", rendered: false, parseHTML: fromData("data-link") },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-affiliate]" }];
  },

  renderHTML({ node }) {
    const attrs = normalizeAffiliate(node.attrs as Partial<AffiliateAttrs>);
    // Dados inválidos (não deveria ocorrer pelo diálogo): bloco vazio e inofensivo.
    if (!attrs) return ["div", { "data-affiliate": "" }];
    return affiliateSpec(attrs, true) as unknown as [
      "div",
      Record<string, string>,
    ];
  },
});
