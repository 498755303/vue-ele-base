let nodeIdSeed = 0;

export default class Node {
  constructor(options) {
    this.id = nodeIdSeed++;
    this.text = null;
    this.checked = false;
    this.allChecked = false;
    this.data = null;
    this.selected = false;
    this.hide = false;
    this.parent = null;
    this.disabled = false;
    for (let name in options) {
      if (options.hasOwnProperty(name)) {
        this[name] = options[name];
      }
    }
    // internal
    this.level = 0;
    this.childNodes = [];

    if (this.parent) {
      this.level = this.parent.level + 1;
    }

    const props = this.props;
    const settings = this.settings;
    this.columnsType = settings
      ? settings[props.columnsType]
      : this.parent.columnsType;
    if (this.data) {
      this.data.columnsType = this.columnsType;
      this.checked =
        this.data.checked ||
        this.data[props.must] ||
        this.data[props.initChecked] ||
        false;
      this.text = this.data[props.label] || null;
      this.disabled = this.data[props.must] || this.data.disabled || false;
      this.selected = this.data.selected || false;
      this.hide = this.data[props.hidden] || false;
      this.must = this.data[props.must] || false;
      this.setData(this.data);
    }
  }

  setData(data) {
    this.data = data;
    this.childNodes = [];

    let children;
    if (this.level === 0 && this.data instanceof Array) {
      children = this.data;
    } else {
      children = this.data[this.props.children] || [];
    }

    for (let i = 0, j = children.length; i < j; i++) {
      this.insertChild({
        data: children[i],
        props: this.props,
        settings: this.settings
      });
    }
  }

  insertChild(child) {
    if (!child) throw new Error("insertChild error: child is required.");

    if (!(child instanceof Node)) {
      // 遍历时保存父节点
      Object.assign(child, {
        parent: this
      });
      child = new Node(child);
    }
    child.level = this.level + 1;
    this.childNodes.push(child);
  }
}
