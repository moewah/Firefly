import { h } from "hastscript";
import { visit } from "unist-util-visit";

/**
 * 给表格添加横向滚动容器的 rehype 插件
 * 解决移动端宽表格溢出问题
 */
export default function rehypeTableWrapper() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      // 只处理 table 元素
      if (node.tagName !== "table") {
        return;
      }

      // 创建带 overflow-x-auto 的 wrapper
      const wrapper = h("div", { class: "overflow-x-auto" }, node);

      // 替换当前的 table 节点为 wrapper
      if (parent && typeof index === "number") {
        parent.children[index] = wrapper;
      }
    });
  };
}